import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTier, getNextTier, pointsToNextTier } from "@/lib/loyalty/tiers";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Fetch profile + balance + recent transactions
    const [profileResult, balanceResult, ledgerResult] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, phone, name, birthday_month, pin_set, referral_code, created_at")
        .eq("id", user.id)
        .single(),
      supabaseAdmin
        .from("customer_balance")
        .select("total_points")
        .eq("customer_id", user.id)
        .single(),
      supabaseAdmin
        .from("points_ledger")
        .select("id, points, reason, bill_amount, note, created_at")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (profileResult.error) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const total = (balanceResult.data?.total_points ?? 0) as number;
    const tier = getTier(total);
    const nextTier = getNextTier(total);
    const toNext = pointsToNextTier(total);

    return NextResponse.json({
      profile: profileResult.data,
      points: {
        total,
        tier: tier.name,
        tier_emoji: tier.emoji,
        tier_color: tier.color,
        next_tier: nextTier?.name ?? null,
        points_to_next: toNext,
      },
      transactions: ledgerResult.data ?? [],
    });
  } catch (err) {
    console.error("[profile] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

// Update profile (name, birthday_month)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      allowed.name = body.name.trim().slice(0, 100);
    }
    if (typeof body.birthday_month === "number" && body.birthday_month >= 1 && body.birthday_month <= 12) {
      allowed.birthday_month = body.birthday_month;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update(allowed)
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[profile PATCH] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
