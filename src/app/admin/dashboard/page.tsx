import { supabaseAdmin } from "@/lib/supabase/admin";
import { getTier } from "@/lib/loyalty/tiers";

export const revalidate = 60;

async function getStats() {
  const [customersResult, ledgerResult, redeemResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "customer"),
    supabaseAdmin
      .from("points_ledger")
      .select("points, created_at, reason")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabaseAdmin
      .from("redemption_codes")
      .select("points_cost", { count: "exact" })
      .eq("used", true)
      .gte("used_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const totalCustomers = customersResult.count ?? 0;
  const ledger = ledgerResult.data ?? [];
  const visitPoints = ledger.filter((l) => l.reason === "visit").reduce((s, l) => s + l.points, 0);
  const totalRedeemed = redeemResult.count ?? 0;

  // Tier breakdown
  const { data: allCustomers } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("role", "customer");

  const tierCounts: Record<string, number> = { Biscuit: 0, Brownie: 0, Kunafa: 0, "Sweet Circle": 0 };

  if (allCustomers) {
    const balances = await Promise.all(
      allCustomers.map(async (c) => {
        const { data } = await supabaseAdmin
          .from("customer_balance")
          .select("total_points")
          .eq("customer_id", c.id)
          .single();
        return (data?.total_points ?? 0) as number;
      })
    );
    balances.forEach((b) => {
      const tier = getTier(b);
      tierCounts[tier.name] = (tierCounts[tier.name] ?? 0) + 1;
    });
  }

  return { totalCustomers, visitPoints, totalRedeemed, tierCounts };
}

export default async function DashboardPage() {
  const { totalCustomers, visitPoints, totalRedeemed, tierCounts } = await getStats();

  const kpis = [
    { label: "Total Members",         value: totalCustomers, color: "#2BA8B2" },
    { label: "Sweets Earned (30d)",   value: visitPoints,    color: "#BA1C0A" },
    { label: "Redemptions (30d)",     value: totalRedeemed,  color: "#74C0C6" },
  ];

  const tiers = [
    { name: "Biscuit",      count: tierCounts.Biscuit,       color: "#C9A84C", range: "0–499" },
    { name: "Brownie",      count: tierCounts.Brownie,        color: "#BA1C0A", range: "500–1499" },
    { name: "Kunafa",       count: tierCounts.Kunafa,         color: "#2BA8B2", range: "1500–3499" },
    { name: "Sweet Circle", count: tierCounts["Sweet Circle"], color: "#F8F2F2", range: "3500+" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">Overview</p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Dashboard</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40 mb-2">
              {kpi.label}
            </p>
            <p className="font-['Pacifico',cursive] text-4xl" style={{ color: kpi.color }}>
              {kpi.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-6">
          Tier Breakdown
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className="text-center p-4 rounded-xl border border-white/5">
              <p className="font-['Pacifico',cursive] text-3xl mb-1" style={{ color: t.color }}>
                {t.count}
              </p>
              <p className="font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#EDE5E5]/60 mb-0.5">
                {t.name}
              </p>
              <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#EDE5E5]/25">
                {t.range} Sweets
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
