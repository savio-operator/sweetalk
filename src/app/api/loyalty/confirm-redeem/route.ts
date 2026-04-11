import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { confirmRedeemSchema } from "@/lib/validations/loyalty";
import { getReward } from "@/lib/loyalty/rewards";
import { notifyRedemptionConfirmed } from "@/lib/loyalty/whatsapp";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth — staff or admin only
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: staffProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!staffProfile || !["staff", "admin"].includes(staffProfile.role)) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }

    // 2. Validate
    const body = await request.json();
    const result = confirmRedeemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { code } = result.data;

    // 3. Find code
    const { data: codeRow } = await supabaseAdmin
      .from("redemption_codes")
      .select("id, customer_id, reward_id, points_cost, expires_at, used")
      .eq("code", code)
      .single();

    if (!codeRow) {
      return NextResponse.json({ error: "Code not found." }, { status: 404 });
    }

    if (codeRow.used) {
      return NextResponse.json({ error: "This code has already been used." }, { status: 400 });
    }

    if (new Date(codeRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "This code has expired." }, { status: 400 });
    }

    // 4. Mark code as used
    await supabaseAdmin
      .from("redemption_codes")
      .update({ used: true, used_at: new Date().toISOString(), confirmed_by: user.id })
      .eq("id", codeRow.id);

    // 5. Deduct points from ledger
    const reward = getReward(codeRow.reward_id);
    await supabaseAdmin.from("points_ledger").insert({
      customer_id: codeRow.customer_id,
      points: -codeRow.points_cost,
      reason: "redemption",
      note: `Redeemed: ${reward?.name ?? `Reward ${codeRow.reward_id}`}`,
      created_by: user.id,
    });

    // 6. Get new balance + notify
    const { data: balance } = await supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", codeRow.customer_id)
      .single();
    const newTotal = (balance?.total_points ?? 0) as number;

    const { data: customerProfile } = await supabaseAdmin
      .from("profiles")
      .select("phone, name")
      .eq("id", codeRow.customer_id)
      .single();

    if (customerProfile) {
      await notifyRedemptionConfirmed(
        customerProfile.phone,
        customerProfile.name,
        reward?.name ?? "Reward",
        newTotal
      );
    }

    return NextResponse.json({
      success: true,
      reward_name: reward?.name ?? "Reward",
      points_deducted: codeRow.points_cost,
      customer_balance: newTotal,
    });
  } catch (err) {
    console.error("[confirm-redeem] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
