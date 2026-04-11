import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTier } from "@/lib/loyalty/tiers";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const type = new URL(request.url).searchParams.get("type") ?? "customers";

    if (type === "customers") {
      const { data: customers } = await supabaseAdmin
        .from("profiles")
        .select("id, phone, name, birthday_month, referral_code, created_at")
        .eq("role", "customer")
        .order("created_at", { ascending: true });

      const rows = await Promise.all(
        (customers ?? []).map(async (c) => {
          const { data: bal } = await supabaseAdmin
            .from("customer_balance")
            .select("total_points")
            .eq("customer_id", c.id)
            .single();
          const total = (bal?.total_points ?? 0) as number;
          const tier = getTier(total);
          return [
            c.phone,
            c.name,
            total,
            tier.name,
            c.birthday_month ?? "",
            c.referral_code ?? "",
            new Date(c.created_at).toLocaleDateString("en-IN"),
          ];
        })
      );

      const csv = [
        ["Phone", "Name", "Total Sweets", "Tier", "Birthday Month", "Referral Code", "Joined"],
        ...rows,
      ]
        .map((r) => r.join(","))
        .join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=customers.csv",
        },
      });
    }

    if (type === "ledger") {
      const { data: ledger } = await supabaseAdmin
        .from("points_ledger")
        .select("id, customer_id, points, reason, bill_amount, bill_reference, note, created_at")
        .order("created_at", { ascending: false });

      const csv = [
        ["ID", "Customer ID", "Points", "Reason", "Bill Amount", "Bill Ref", "Note", "Date"],
        ...(ledger ?? []).map((l) => [
          l.id,
          l.customer_id,
          l.points,
          l.reason,
          l.bill_amount ?? "",
          l.bill_reference ?? "",
          (l.note ?? "").replace(/,/g, ";"),
          new Date(l.created_at).toLocaleString("en-IN"),
        ]),
      ]
        .map((r) => r.join(","))
        .join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=ledger.csv",
        },
      });
    }

    return NextResponse.json({ error: "Invalid type." }, { status: 400 });
  } catch (err) {
    console.error("[reports] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
