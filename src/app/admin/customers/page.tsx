"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Customer {
  id: string;
  phone: string;
  name: string;
  created_at: string;
  total_points: number;
  tier: string;
  tier_emoji: string;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">Members</p>
          <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Customers</h1>
        </div>
        <input
          type="text"
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-white/5 border border-white/10 rounded-full font-['Lora',serif] italic text-[#F8F2F2] text-sm px-5 py-2.5 outline-none focus:border-[#2BA8B2] transition-colors duration-200 placeholder:text-white/20 min-w-[220px]"
        />
      </div>

      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-['Lora',serif] italic text-[#EDE5E5]/30">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center font-['Lora',serif] italic text-[#EDE5E5]/30">No customers found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Phone", "Sweets", "Tier", "Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/30">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-5 py-3 font-['Lora',serif] italic text-[#F8F2F2] text-sm">{c.name || "—"}</td>
                  <td className="px-5 py-3 font-['Jost',sans-serif] text-[0.65rem] tracking-[1px] text-[#EDE5E5]/60">{c.phone}</td>
                  <td className="px-5 py-3 font-['Pacifico',cursive] text-[#BA1C0A] text-lg">{c.total_points}</td>
                  <td className="px-5 py-3">
                    <span className="font-['Jost',sans-serif] text-[0.58rem] tracking-[1px] uppercase text-[#2BA8B2]">
                      {c.tier_emoji} {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-['Jost',sans-serif] text-[0.55rem] tracking-[1px] text-[#EDE5E5]/30">
                    {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#74C0C6] hover:text-[#2BA8B2] transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[1px] uppercase text-[#EDE5E5]/30">
            {total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-white/10 font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#EDE5E5]/50 hover:border-[#2BA8B2] hover:text-[#2BA8B2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= total}
              className="px-4 py-2 rounded-full border border-white/10 font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#EDE5E5]/50 hover:border-[#2BA8B2] hover:text-[#2BA8B2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
