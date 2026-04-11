"use client";

import { useState } from "react";

export default function EarnPage() {
  const [phone, setPhone] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billRef, setBillRef] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ earned: number; total: number; tier: string; customer_name: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);

    const res = await fetch("/api/loyalty/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_phone: phone,
        bill_amount: parseFloat(billAmount),
        bill_reference: billRef || undefined,
        note: note || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("success");
    setResult(data);
    // Reset form after 6 seconds
    setTimeout(() => {
      setStatus("idle");
      setResult(null);
      setPhone("");
      setBillAmount("");
      setBillRef("");
      setNote("");
    }, 6000);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">
          Daily Tool
        </p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Add Sweets</h1>
        <p className="font-['Lora',serif] italic text-[#EDE5E5]/50 text-sm mt-2">
          Enter the customer phone and bill amount to credit Sweets.
        </p>
      </div>

      {/* Success banner */}
      {status === "success" && result && (
        <div className="mb-6 bg-[#2BA8B2]/10 border border-[#2BA8B2]/30 rounded-2xl p-6 text-center">
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-1">
            Points Added
          </p>
          <p className="font-['Pacifico',cursive] text-[#F8F2F2] text-4xl mb-1">
            +{result.earned}
          </p>
          <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-[2px] text-[#EDE5E5]/60 mb-3">
            Sweets for {result.customer_name}
          </p>
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/10">
            <div className="text-center">
              <p className="font-['Pacifico',cursive] text-[#BA1C0A] text-xl">{result.total}</p>
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Total</p>
            </div>
            <div className="text-center">
              <p className="font-['Pacifico',cursive] text-[#2BA8B2] text-xl">{result.tier}</p>
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Tier</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {status !== "success" && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Customer Phone <span className="text-[#BA1C0A]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="9876543210"
              inputMode="numeric"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-lg py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
            />
          </div>

          {/* Bill Amount */}
          <div className="flex flex-col gap-2">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Bill Amount (₹) <span className="text-[#BA1C0A]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#EDE5E5]/30 font-['Lora',serif] text-lg">₹</span>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                placeholder="0.00"
                inputMode="decimal"
                className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-lg py-2 pl-5 pr-0 outline-none transition-colors duration-200 placeholder:text-white/20 w-full"
              />
            </div>
            {billAmount && parseFloat(billAmount) > 0 && (
              <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] text-[#74C0C6]">
                = {Math.floor(parseFloat(billAmount) * 0.1)} Sweets
              </p>
            )}
          </div>

          {/* Bill Ref */}
          <div className="flex flex-col gap-2">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              PetPooja Ref (optional)
            </label>
            <input
              type="text"
              value={billRef}
              onChange={(e) => setBillRef(e.target.value)}
              placeholder="PP-20260411-001"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              placeholder="e.g. Birthday visit"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
            />
          </div>

          {error && (
            <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Adding Sweets..." : "Add Sweets"}
          </button>
        </form>
      )}

      <p className="text-center mt-4 font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/20">
        ₹100 = 10 Sweets
      </p>
    </div>
  );
}
