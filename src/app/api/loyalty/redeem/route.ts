import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redeemRateLimit } from "@/lib/rate-limit";
import { redeemRequestSchema } from "@/lib/validations/loyalty";
import { getReward } from "@/lib/loyalty/rewards";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth — customer only
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // 2. Rate limit per customer
    const { success } = await redeemRateLimit.limit(`redeem:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many redemption attempts. Please wait." }, { status: 429 });
    }

    // 3. Validate input
    const body = await request.json();
    const result = redeemRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { reward_id, pin } = result.data;

    // 4. Verify PIN
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("pin_hash, pin_set")
      .eq("id", user.id)
      .single();

    if (!profile?.pin_set || !profile.pin_hash) {
      return NextResponse.json({ error: "Please set your PIN first." }, { status: 400 });
    }

    const pinValid = await bcrypt.compare(pin, profile.pin_hash);
    if (!pinValid) {
      return NextResponse.json({ error: "Incorrect PIN." }, { status: 400 });
    }

    // 5. Check reward exists
    const reward = getReward(reward_id);
    if (!reward) {
      return NextResponse.json({ error: "Invalid reward." }, { status: 400 });
    }

    // 6. Check balance
    const { data: balance } = await supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", user.id)
      .single();

    const total = (balance?.total_points ?? 0) as number;
    if (total < reward.points) {
      return NextResponse.json(
        { error: `Insufficient Sweets. You need ${reward.points} but have ${total}.` },
        { status: 400 }
      );
    }

    // 7. Check no active (unexpired, unused) code already exists
    const { data: activeCode } = await supabaseAdmin
      .from("redemption_codes")
      .select("id, expires_at")
      .eq("customer_id", user.id)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (activeCode) {
      return NextResponse.json(
        { error: "You already have an active redemption code. Show it to staff to use it." },
        { status: 400 }
      );
    }

    // 8. Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const { error: insertError } = await supabaseAdmin.from("redemption_codes").insert({
      customer_id: user.id,
      code,
      reward_id,
      points_cost: reward.points,
      expires_at: expiresAt.toISOString(),
      used: false,
    });

    if (insertError) {
      console.error("[redeem] DB error:", insertError.message);
      return NextResponse.json({ error: "Failed to generate code." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      code,
      reward_name: reward.name,
      expires_at: expiresAt.toISOString(),
      points_cost: reward.points,
    });
  } catch (err) {
    console.error("[redeem] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
