"use client";

import { useState } from "react";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ reward_name: string; points_deducted: number; customer_balance: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setStatus("loading");
    setError("");

    const res = await fetch("/api/loyalty/confirm-redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("success");
    setResult(data);
    setTimeout(() => {
      setStatus("idle");
      setResult(null);
      setCode("");
    }, 8000);
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">
          Redemption
        </p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Confirm Code</h1>
        <p className="font-['Lora',serif] italic text-[#EDE5E5]/50 text-sm mt-2">
          Enter the 6-digit code shown on the customer's phone.
        </p>
      </div>

      {status === "success" && result && (
        <div className="mb-6 bg-[#2BA8B2]/10 border border-[#2BA8B2]/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-['Pacifico',cursive] text-[#F8F2F2] text-xl mb-1">{result.reward_name}</p>
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#74C0C6]">
            Redeemed
          </p>
          <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-white/10">
            <div className="text-center">
              <p className="font-['Pacifico',cursive] text-[#BA1C0A] text-xl">-{result.points_deducted}</p>
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Deducted</p>
            </div>
            <div className="text-center">
              <p className="font-['Pacifico',cursive] text-[#2BA8B2] text-xl">{result.customer_balance}</p>
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Balance</p>
            </div>
          </div>
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              6-Digit Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              inputMode="numeric"
              placeholder="______"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] text-[#F8F2F2] text-4xl tracking-[12px] py-3 text-center outline-none transition-colors duration-200 placeholder:text-white/10"
            />
          </div>

          {error && (
            <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A] text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || code.length !== 6}
            className="w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Confirming..." : "Confirm Redemption"}
          </button>
        </form>
      )}
    </div>
  );
}
