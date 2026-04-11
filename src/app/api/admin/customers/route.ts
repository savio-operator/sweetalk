import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTier } from "@/lib/loyalty/tiers";

export async function GET(request: NextRequest) {
  try {
    // 1. Auth — staff or admin
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

    // 2. Query params
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    // 3. Fetch customers with balance
    let query = supabaseAdmin
      .from("profiles")
      .select("id, phone, name, created_at, birthday_month", { count: "exact" })
      .eq("role", "customer")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (search) {
      query = query.or(`phone.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: customers, count, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Failed to fetch customers." }, { status: 500 });
    }

    // 4. Enrich with balances
    const enriched = await Promise.all(
      (customers ?? []).map(async (c) => {
        const { data: bal } = await supabaseAdmin
          .from("customer_balance")
          .select("total_points")
          .eq("customer_id", c.id)
          .single();
        const total = (bal?.total_points ?? 0) as number;
        const tier = getTier(total);
        return { ...c, total_points: total, tier: tier.name, tier_emoji: tier.emoji };
      })
    );

    return NextResponse.json({
      customers: enriched,
      total: count ?? 0,
      page,
      page_size: pageSize,
    });
  } catch (err) {
    console.error("[admin/customers] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
