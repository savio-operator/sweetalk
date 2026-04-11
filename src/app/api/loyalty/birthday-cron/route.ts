import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyBirthday } from "@/lib/loyalty/whatsapp";

// Triggered daily at 9 AM via cron-job.org
// Requires CRON_SECRET header for security
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Find customers with birthday this month who haven't received bonus today
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Get all customers with birthday this month
  const { data: customers, error } = await supabaseAdmin
    .from("profiles")
    .select("id, phone, name")
    .eq("role", "customer")
    .eq("birthday_month", currentMonth);

  if (error) {
    console.error("[birthday-cron] fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch customers." }, { status: 500 });
  }

  if (!customers || customers.length === 0) {
    return NextResponse.json({ success: true, processed: 0 });
  }

  let processed = 0;
  const errors: string[] = [];

  for (const customer of customers) {
    // Check if already received birthday bonus today
    const { data: existing } = await supabaseAdmin
      .from("points_ledger")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("reason", "birthday")
      .gte("created_at", `${todayStr}T00:00:00Z`)
      .limit(1)
      .single();

    if (existing) continue; // Already credited today

    // Add 100 birthday bonus
    const { error: insertError } = await supabaseAdmin.from("points_ledger").insert({
      customer_id: customer.id,
      points: 100,
      reason: "birthday",
      note: `Birthday month bonus — ${new Date().toLocaleString("default", { month: "long" })}`,
    });

    if (insertError) {
      errors.push(`${customer.phone}: ${insertError.message}`);
      continue;
    }

    await notifyBirthday(customer.phone, customer.name);
    processed++;
  }

  if (errors.length > 0) {
    console.error("[birthday-cron] Some errors:", errors);
  }

  return NextResponse.json({ success: true, processed, errors: errors.length });
}
