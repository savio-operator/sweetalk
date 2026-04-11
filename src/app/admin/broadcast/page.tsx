"use client";

import { useState } from "react";

const TIER_OPTIONS = [
  { value: "all",          label: "All Members" },
  { value: "biscuit",      label: "Biscuit Tier" },
  { value: "brownie",      label: "Brownie Tier" },
  { value: "kunafa",       label: "Kunafa Tier" },
  { value: "sweet_circle", label: "Sweet Circle Tier" },
];

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!confirm(`Send this message to ${filter === "all" ? "ALL" : filter} members via WhatsApp? This cannot be undone.`)) return;

    setStatus("loading");
    setError("");

    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, filter }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Broadcast failed.");
      return;
    }

    setStatus("success");
    setResult({ sent: data.sent, total: data.total });
    setMessage("");
    setTimeout(() => setStatus("idle"), 8000);
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">
          Secret Sweets
        </p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Broadcast</h1>
        <p className="font-['Lora',serif] italic text-[#EDE5E5]/50 text-sm mt-2">
          Send a WhatsApp message to all members or a specific tier.
        </p>
      </div>

      {status === "success" && result && (
        <div className="mb-6 bg-[#2BA8B2]/10 border border-[#2BA8B2]/30 rounded-2xl p-6 text-center">
          <p className="font-['Pacifico',cursive] text-[#F8F2F2] text-2xl mb-1">
            Sent to {result.sent} / {result.total}
          </p>
          <p className="font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#74C0C6]">
            Messages dispatched
          </p>
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          {/* Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Audience
            </label>
            <div className="flex flex-wrap gap-2">
              {TIER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={`px-4 py-2 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase transition-all duration-200 ${
                    filter === opt.value
                      ? "bg-[#BA1C0A] text-white border border-[#BA1C0A]"
                      : "bg-transparent text-[#EDE5E5]/40 border border-white/10 hover:border-white/25 hover:text-[#EDE5E5]/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
              Message <span className="text-[#BA1C0A]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              maxLength={500}
              rows={5}
              placeholder="🎉 Exclusive offer for Sweet Circle members only!..."
              className="bg-transparent border border-white/10 rounded-xl focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm p-3 outline-none transition-colors duration-200 placeholder:text-white/15 resize-none"
            />
            <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#EDE5E5]/20 text-right">
              {message.length} / 500
            </p>
          </div>

          {error && (
            <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A]">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || message.length < 10}
            className="w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending..." : `Send Broadcast`}
          </button>
        </form>
      )}
    </div>
  );
}
