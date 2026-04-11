import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { broadcastSchema } from "@/lib/validations/loyalty";
import { getTier } from "@/lib/loyalty/tiers";

const WA_URL = process.env.WA_SERVER_URL;
const WA_SECRET = process.env.WA_SERVER_SECRET;

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

    if (!WA_URL || !WA_SECRET) {
      return NextResponse.json({ error: "WhatsApp server not configured." }, { status: 503 });
    }

    // 2. Validate
    const body = await request.json();
    const result = broadcastSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { message, filter } = result.data;

    // 3. Get all customers
    const { data: customers } = await supabaseAdmin
      .from("profiles")
      .select("id, phone, name")
      .eq("role", "customer");

    if (!customers || customers.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    // 4. Filter by tier if needed
    let targets = customers;
    if (filter !== "all") {
      const tierMap: Record<string, string> = {
        biscuit: "Biscuit",
        brownie: "Brownie",
        kunafa: "Kunafa",
        sweet_circle: "Sweet Circle",
      };
      const targetTierName = tierMap[filter];

      const withBalances = await Promise.all(
        customers.map(async (c) => {
          const { data: bal } = await supabaseAdmin
            .from("customer_balance")
            .select("total_points")
            .eq("customer_id", c.id)
            .single();
          const total = (bal?.total_points ?? 0) as number;
          const tier = getTier(total);
          return { ...c, tier_name: tier.name };
        })
      );
      targets = withBalances.filter((c) => c.tier_name === targetTierName);
    }

    // 5. Send messages (with rate limiting — fire and forget per message)
    let sent = 0;
    for (const customer of targets) {
      const normalized = customer.phone.replace(/\D/g, "");
      if (normalized.length < 7) continue;
      const to = normalized.length === 10 ? `91${normalized}` : normalized;

      try {
        await fetch(`${WA_URL}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${WA_SECRET}`,
          },
          body: JSON.stringify({ to, message }),
        });
        sent++;
      } catch {
        // Non-fatal per message
      }
    }

    return NextResponse.json({ success: true, sent, total: targets.length });
  } catch (err) {
    console.error("[broadcast] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
