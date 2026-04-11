"use client";

import { useState } from "react";

export default function ReportsDownload() {
  const [loading, setLoading] = useState<string | null>(null);

  const download = async (type: "customers" | "ledger") => {
    setLoading(type);
    const res = await fetch(`/api/admin/reports?type=${type}`);
    if (!res.ok) {
      setLoading(null);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sweetcircle_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
  };

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
      <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-5">
        Export CSV
      </p>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => download("customers")}
          disabled={loading !== null}
          className="px-6 py-3 bg-[#BA1C0A]/15 hover:bg-[#BA1C0A]/25 border border-[#BA1C0A]/30 hover:border-[#BA1C0A]/50 text-[#BA1C0A] rounded-full font-['Jost',sans-serif] text-[0.62rem] tracking-[2px] uppercase transition-all duration-200 disabled:opacity-50"
        >
          {loading === "customers" ? "Exporting..." : "All Customers"}
        </button>
        <button
          onClick={() => download("ledger")}
          disabled={loading !== null}
          className="px-6 py-3 bg-[#2BA8B2]/10 hover:bg-[#2BA8B2]/20 border border-[#2BA8B2]/25 hover:border-[#2BA8B2]/40 text-[#2BA8B2] rounded-full font-['Jost',sans-serif] text-[0.62rem] tracking-[2px] uppercase transition-all duration-200 disabled:opacity-50"
        >
          {loading === "ledger" ? "Exporting..." : "Points Ledger"}
        </button>
      </div>
    </div>
  );
}
