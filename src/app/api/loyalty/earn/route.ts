import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { pointsInsertRateLimit } from "@/lib/rate-limit";
import { earnSchema } from "@/lib/validations/loyalty";
import { billToPoints, getTier } from "@/lib/loyalty/tiers";
import { notifyPointsEarned, notifyTierUpgrade } from "@/lib/loyalty/whatsapp";

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

    // 2. Rate limit per staff account
    const { success } = await pointsInsertRateLimit.limit(`staff:${user.id}`);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit reached. Maximum 20 transactions per hour per staff." },
        { status: 429 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const result = earnSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { customer_phone, bill_amount, bill_reference, note } = result.data;
    const normalized = customer_phone.replace(/\D/g, "");

    // 4. Look up customer
    const { data: customer } = await supabaseAdmin
      .from("profiles")
      .select("id, name, phone, role")
      .eq("phone", normalized)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found. Ask them to sign up at /loyalty first." }, { status: 404 });
    }
    if (customer.role !== "customer") {
      return NextResponse.json({ error: "Cannot add points to a staff/admin account." }, { status: 400 });
    }

    // 5. Get current balance before adding
    const { data: balanceBefore } = await supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", customer.id)
      .single();
    const totalBefore = (balanceBefore?.total_points ?? 0) as number;
    const tierBefore = getTier(totalBefore);

    // 6. Calculate points
    const earned = billToPoints(bill_amount);

    // 7. Insert to ledger
    const { error: insertError } = await supabaseAdmin.from("points_ledger").insert({
      customer_id: customer.id,
      points: earned,
      reason: "visit",
      bill_amount,
      bill_reference: bill_reference ?? null,
      note: note ?? null,
      created_by: user.id,
    });

    if (insertError) {
      console.error("[earn] DB error:", insertError.message);
      return NextResponse.json({ error: "Failed to add points." }, { status: 500 });
    }

    // 8. Get new total
    const { data: balanceAfter } = await supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", customer.id)
      .single();
    const totalAfter = (balanceAfter?.total_points ?? 0) as number;
    const tierAfter = getTier(totalAfter);

    // 9. Notify customer
    await notifyPointsEarned(normalized, customer.name, earned, totalAfter, tierAfter.name);

    // 10. Tier upgrade notification
    if (tierAfter.name !== tierBefore.name) {
      await notifyTierUpgrade(normalized, customer.name, tierAfter.name, totalAfter);
    }

    return NextResponse.json({
      success: true,
      earned,
      total: totalAfter,
      tier: tierAfter.name,
      customer_name: customer.name,
    });
  } catch (err) {
    console.error("[earn] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
