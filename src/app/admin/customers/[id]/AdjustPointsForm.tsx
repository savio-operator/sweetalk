"use client";

import { useState } from "react";

export default function AdjustPointsForm({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/admin/adjust-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        points: parseInt(points, 10),
        note,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Failed to adjust.");
      return;
    }

    setStatus("success");
    setMessage(`Adjusted. New balance: ${data.new_total} Sweets.`);
    setPoints("");
    setNote("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
      <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-4">
        Manual Adjustment
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Points (+ / −)
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              placeholder="+100 or -50"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
            />
          </div>
          <div className="flex-[2] flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Reason (for audit)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              minLength={3}
              maxLength={200}
              placeholder={`e.g. Goodwill for ${customerName}`}
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
            />
          </div>
        </div>

        {message && (
          <p className={`font-['Jost',sans-serif] text-[0.62rem] tracking-wider ${status === "error" ? "text-[#BA1C0A]" : "text-[#74C0C6]"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="self-start px-6 py-2.5 bg-[#BA1C0A]/20 hover:bg-[#BA1C0A]/30 border border-[#BA1C0A]/30 hover:border-[#BA1C0A]/50 text-[#BA1C0A] rounded-full font-['Jost',sans-serif] text-[0.62rem] tracking-[2px] uppercase transition-all duration-200 disabled:opacity-50"
        >
          {status === "loading" ? "Adjusting..." : "Apply Adjustment"}
        </button>
      </form>
    </div>
  );
}
