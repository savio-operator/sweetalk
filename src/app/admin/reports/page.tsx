import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReportsDownload from "./ReportsDownload";

export const revalidate = 0;

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/admin/dashboard");

  // Summary stats
  const [customersCount, ledgerResult, redeemResult] = await Promise.all([
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    supabaseAdmin.from("points_ledger").select("points, reason"),
    supabaseAdmin.from("redemption_codes").select("points_cost, used").eq("used", true),
  ]);

  const totalCustomers = customersCount.count ?? 0;
  const ledger = ledgerResult.data ?? [];
  const totalEarned = ledger.filter((l) => l.points > 0).reduce((s, l) => s + l.points, 0);
  const totalRedeemed = (redeemResult.data ?? []).reduce((s, r) => s + r.points_cost, 0);
  const outstanding = totalEarned - totalRedeemed;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">Analytics</p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Reports</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Members",          value: totalCustomers, color: "#2BA8B2" },
          { label: "Sweets Issued",    value: totalEarned,    color: "#BA1C0A" },
          { label: "Sweets Redeemed",  value: totalRedeemed,  color: "#74C0C6" },
          { label: "Outstanding",      value: outstanding,    color: "#F8F2F2" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
            <p className="font-['Pacifico',cursive] text-3xl mb-1" style={{ color: s.color }}>
              {s.value.toLocaleString()}
            </p>
            <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[2px] uppercase text-[#EDE5E5]/35">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Download CSV */}
      <ReportsDownload />
    </div>
  );
}
