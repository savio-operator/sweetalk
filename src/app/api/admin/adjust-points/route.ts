import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { adjustPointsSchema } from "@/lib/validations/loyalty";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth — admin only
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

    // 2. Validate
    const body = await request.json();
    const result = adjustPointsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { customer_id, points, note } = result.data;

    // 3. Verify customer exists
    const { data: customer } = await supabaseAdmin
      .from("profiles")
      .select("id, name")
      .eq("id", customer_id)
      .eq("role", "customer")
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    // 4. Insert adjustment (negative points = deduction)
    const { error: insertError } = await supabaseAdmin.from("points_ledger").insert({
      customer_id,
      points,
      reason: "adjustment",
      note: `[Admin] ${note}`,
      created_by: user.id,
    });

    if (insertError) {
      console.error("[adjust-points] DB error:", insertError.message);
      return NextResponse.json({ error: "Failed to adjust points." }, { status: 500 });
    }

    // 5. Get new balance
    const { data: balance } = await supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", customer_id)
      .single();

    return NextResponse.json({
      success: true,
      customer_name: customer.name,
      adjustment: points,
      new_total: balance?.total_points ?? 0,
    });
  } catch (err) {
    console.error("[adjust-points] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
