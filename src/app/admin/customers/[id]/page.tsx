import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { getTier, getNextTier, pointsToNextTier } from "@/lib/loyalty/tiers";
import AdjustPointsForm from "./AdjustPointsForm";

export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const [profileResult, balanceResult, ledgerResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, phone, name, birthday_month, referral_code, created_at")
      .eq("id", id)
      .eq("role", "customer")
      .single(),
    supabaseAdmin
      .from("customer_balance")
      .select("total_points")
      .eq("customer_id", id)
      .single(),
    supabaseAdmin
      .from("points_ledger")
      .select("id, points, reason, bill_amount, note, created_at, created_by")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (profileResult.error || !profileResult.data) notFound();

  const profile = profileResult.data;
  const total = (balanceResult.data?.total_points ?? 0) as number;
  const tier = getTier(total);
  const nextTier = getNextTier(total);
  const toNext = pointsToNextTier(total);
  const transactions = ledgerResult.data ?? [];

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <a href="/admin/customers" className="inline-flex items-center gap-2 font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#74C0C6] hover:text-[#2BA8B2] transition-colors mb-6">
        ← Back to Customers
      </a>

      {/* Profile header */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-2xl mb-1">
              {profile.name || "Unnamed"}
            </h1>
            <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-[1px] text-[#EDE5E5]/50">{profile.phone}</p>
            {profile.birthday_month && (
              <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#74C0C6] mt-1">
                🎂 Birthday: {MONTH_NAMES[(profile.birthday_month - 1) % 12]}
              </p>
            )}
            <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#EDE5E5]/20 mt-1">
              Joined {new Date(profile.created_at).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-['Pacifico',cursive] text-[#BA1C0A] text-4xl">{total}</p>
            <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Sweets</p>
            <p className="font-['Jost',sans-serif] text-[0.6rem] tracking-[1px] mt-1" style={{ color: tier.color }}>
              {tier.emoji} {tier.name}
            </p>
            {nextTier && toNext !== null && (
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[1px] text-[#EDE5E5]/30 mt-0.5">
                {toNext} to {nextTier.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Manual adjust */}
      <AdjustPointsForm customerId={id} customerName={profile.name || "this customer"} />

      {/* Transaction history */}
      <div className="mt-6 bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6]">
            Transaction History
          </p>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center font-['Lora',serif] italic text-[#EDE5E5]/30">No transactions yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((t) => (
              <div key={t.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/50 mb-0.5">
                    {t.reason}
                    {t.bill_amount ? ` · ₹${Number(t.bill_amount).toFixed(0)}` : ""}
                  </p>
                  {t.note && (
                    <p className="font-['Lora',serif] italic text-[#EDE5E5]/30 text-[0.7rem]">{t.note}</p>
                  )}
                  <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#EDE5E5]/20 mt-0.5">
                    {new Date(t.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <p className={`font-['Pacifico',cursive] text-xl ${t.points >= 0 ? "text-[#2BA8B2]" : "text-[#BA1C0A]"}`}>
                  {t.points >= 0 ? "+" : ""}{t.points}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
