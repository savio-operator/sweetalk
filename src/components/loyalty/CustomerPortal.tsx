"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { REWARDS } from "@/lib/loyalty/rewards";
import { TIERS } from "@/lib/loyalty/tiers";
import type { User } from "@supabase/supabase-js";

// ── Step types ──────────────────────────────────────────────────────────────
type Step = "phone" | "otp" | "set-pin" | "dashboard";

interface ProfileData {
  profile: {
    id: string;
    phone: string;
    name: string;
    birthday_month: number | null;
    pin_set: boolean;
    referral_code: string;
  };
  points: {
    total: number;
    tier: string;
    tier_emoji: string;
    tier_color: string;
    next_tier: string | null;
    points_to_next: number | null;
  };
  transactions: Array<{
    id: string;
    points: number;
    reason: string;
    bill_amount: number | null;
    note: string | null;
    created_at: string;
  }>;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CustomerPortal() {
  const [step, setStep] = useState<Step>("phone");
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const supabase = createClient();

  // Check existing session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setStep("dashboard");
        loadProfile();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    const res = await fetch("/api/loyalty/profile");
    if (res.ok) {
      const data = await res.json();
      setProfileData(data);
      // If PIN not set, go to set-pin step
      if (!data.profile.pin_set) setStep("set-pin");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileData(null);
    setStep("phone");
  };

  return (
    <div className="min-h-screen bg-[#F8F2F2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-['Pacifico',cursive] text-[#BA1C0A] text-3xl mb-1">Sweet Circle</h1>
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#2BA8B2]">
            Sweetalks Loyalty
          </p>
        </div>

        {step === "phone" && (
          <PhoneStep
            onVerified={(tokenHash, pinSet, name) => {
              if (!tokenHash) {
                // Should not happen in practice — surface clearly rather than hanging
                console.error("[CustomerPortal] verify-otp returned null token_hash");
                return;
              }
              // Exchange token for session
              supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" }).then(({ data, error }) => {
                if (error) {
                  console.error("[CustomerPortal] verifyOtp error:", error.message);
                  return;
                }
                if (data.user) {
                  setUser(data.user);
                  if (!pinSet) setStep("set-pin");
                  else {
                    setStep("dashboard");
                    loadProfile();
                  }
                }
              });
            }}
          />
        )}

        {step === "set-pin" && (
          <SetPinStep
            onPinSet={() => {
              setStep("dashboard");
              loadProfile();
            }}
          />
        )}

        {step === "dashboard" && profileData && (
          <Dashboard data={profileData} onLogout={handleLogout} onRefresh={loadProfile} />
        )}

        {step === "dashboard" && !profileData && (
          <div className="text-center font-['Lora',serif] italic text-[#BA1C0A]/50 py-16">
            Loading your account...
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phone → OTP step ─────────────────────────────────────────────────────────
function PhoneStep({ onVerified }: { onVerified: (tokenHash: string, pinSet: boolean, name: string) => void }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/loyalty/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to send OTP.");
      setLoading(false);
      return;
    }
    setOtpSent(true);
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/loyalty/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Verification failed.");
      setLoading(false);
      return;
    }

    onVerified(data.token_hash, data.pin_set, name);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5E5] shadow-[0_8px_48px_rgba(186,28,10,0.08)] p-8">
      {!otpSent ? (
        <form onSubmit={sendOtp} className="flex flex-col gap-5">
          <div>
            <h2 className="font-['Charlotte',cursive] text-[#991001] text-2xl mb-1">Welcome Back</h2>
            <p className="font-['Lora',serif] italic text-[#BA1C0A]/55 text-sm">
              Enter your phone to receive an OTP via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2]">
              Phone / WhatsApp <span className="text-[#BA1C0A]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="9876543210"
              inputMode="numeric"
              className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#0D0D0D] text-lg py-2 outline-none transition-colors duration-200 placeholder:text-[#0D0D0D]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2]">
              Your Name (for new accounts)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arjun M."
              className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#0D0D0D] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-[#0D0D0D]/20"
            />
          </div>

          {error && <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP via WhatsApp"}
          </button>

          <p className="text-center font-['Lora',serif] italic text-[#BA1C0A]/40 text-[0.75rem]">
            By continuing, you agree to our{" "}
            <a href="/loyalty/terms" className="underline underline-offset-2 hover:text-[#BA1C0A]">Terms & Conditions</a>.
          </p>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="flex flex-col gap-5">
          <div>
            <h2 className="font-['Charlotte',cursive] text-[#991001] text-2xl mb-1">Enter OTP</h2>
            <p className="font-['Lora',serif] italic text-[#BA1C0A]/55 text-sm">
              We sent a 6-digit code to {phone} via WhatsApp. Valid for 5 minutes.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2]">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              inputMode="numeric"
              placeholder="_ _ _ _ _ _"
              className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] text-[#0D0D0D] text-3xl tracking-[10px] text-center py-2 outline-none transition-colors duration-200 placeholder:text-[#0D0D0D]/15"
            />
          </div>

          {error && <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A]">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
            className="text-center font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#2BA8B2] hover:text-[#2BA8B2]/70"
          >
            ← Change Number
          </button>
        </form>
      )}
    </div>
  );
}

// ── Set PIN step ──────────────────────────────────────────────────────────────
function SetPinStep({ onPinSet }: { onPinSet: () => void }) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== confirm) { setError("PINs don't match."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/loyalty/set-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed."); setLoading(false); return; }
    onPinSet();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5E5] shadow-[0_8px_48px_rgba(186,28,10,0.08)] p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="font-['Charlotte',cursive] text-[#991001] text-2xl mb-1">Set Your PIN</h2>
          <p className="font-['Lora',serif] italic text-[#BA1C0A]/55 text-sm">
            Choose a 4-digit PIN. You'll need this to redeem your Sweets.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2]">4-Digit PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] text-[#0D0D0D] text-2xl tracking-[8px] py-2 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2]">Confirm PIN</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] text-[#0D0D0D] text-2xl tracking-[8px] py-2 outline-none transition-colors"
          />
        </div>

        {error && <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A]">{error}</p>}

        <button
          type="submit"
          disabled={loading || pin.length !== 4 || confirm.length !== 4}
          className="w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Set PIN & Continue"}
        </button>
      </form>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ data, onLogout, onRefresh }: { data: ProfileData; onLogout: () => void; onRefresh: () => void }) {
  const [redeemMode, setRedeemMode] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Balance card */}
      <div className="bg-[#991001] rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[3px] uppercase text-[#74C0C6] mb-1">
                Your Sweets
              </p>
              <p className="font-['Pacifico',cursive] text-[#F8F2F2] text-6xl">
                {data.points.total}
              </p>
            </div>
            <div className="text-right">
              <p className="font-['Pacifico',cursive] text-2xl" style={{ color: data.points.tier_color }}>
                {data.points.tier_emoji} {data.points.tier}
              </p>
              {data.points.next_tier && data.points.points_to_next !== null && (
                <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[1px] text-[#F8F2F2]/40 mt-1">
                  {data.points.points_to_next} to {data.points.next_tier}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="font-['Lora',serif] italic text-[#F8F2F2]/80 text-sm">{data.profile.name || "Sweet Circle Member"}</p>
              <p className="font-['Jost',sans-serif] text-[0.52rem] tracking-[1px] text-[#F8F2F2]/35">{data.profile.phone}</p>
            </div>
            <button onClick={onLogout} className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#F8F2F2]/30 hover:text-[#F8F2F2]/60 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Tier progress bar */}
      <TierProgress total={data.points.total} />

      {/* Redeem toggle */}
      <button
        onClick={() => setRedeemMode(!redeemMode)}
        className="w-full py-3.5 border border-[#BA1C0A]/30 hover:border-[#BA1C0A] text-[#BA1C0A] rounded-full font-['Jost',sans-serif] text-[0.68rem] tracking-[2px] uppercase transition-all duration-200 hover:bg-[#BA1C0A]/5"
      >
        {redeemMode ? "← Back" : "Redeem Sweets →"}
      </button>

      {redeemMode ? (
        <RedeemSection total={data.points.total} onSuccess={onRefresh} />
      ) : (
        <TransactionHistory transactions={data.transactions} />
      )}
    </div>
  );
}

function TierProgress({ total }: { total: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE5E5] p-5">
      <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[3px] uppercase text-[#2BA8B2] mb-4">
        Tier Progress
      </p>
      <div className="flex items-center gap-2">
        {TIERS.map((tier, i) => (
          <div key={tier.name} className="flex-1 relative">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                background: total >= tier.min ? tier.color : "#EDE5E5",
              }}
            />
            <p className="font-['Jost',sans-serif] text-[0.45rem] tracking-[1px] uppercase mt-1 text-center"
              style={{ color: total >= tier.min ? tier.color : "#EDE5E5" }}>
              {tier.emoji}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {TIERS.map((t) => (
          <p key={t.name} className="flex-1 text-center font-['Jost',sans-serif] text-[0.42rem] tracking-[0.5px]"
            style={{ color: total >= t.min ? "#BA1C0A" : "#EDE5E5" }}>
            {t.name === "Sweet Circle" ? "⭐" : t.min}
          </p>
        ))}
      </div>
    </div>
  );
}

function RedeemSection({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<{ code: string; reward_name: string; expires_at: string } | null>(null);
  const [error, setError] = useState("");

  const handleRedeem = async (rewardId: number) => {
    if (!pin || pin.length !== 4) { setError("Enter your 4-digit PIN."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/loyalty/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reward_id: rewardId, pin }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed."); setLoading(false); return; }

    setCode({ code: data.code, reward_name: data.reward_name, expires_at: data.expires_at });
    setLoading(false);
    setPin("");
    onSuccess();
  };

  if (code) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE5E5] p-6 text-center">
        <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[3px] uppercase text-[#2BA8B2] mb-2">
          Show this to staff
        </p>
        <p className="font-['Pacifico',cursive] text-[#991001] text-6xl tracking-[8px] my-4">{code.code}</p>
        <p className="font-['Lora',serif] italic text-[#BA1C0A]/70 text-sm">{code.reward_name}</p>
        <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[1px] uppercase text-[#BA1C0A]/35 mt-2">
          Valid until {new Date(code.expires_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-[#EDE5E5] p-5">
        <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[3px] uppercase text-[#2BA8B2] mb-3">
          Enter PIN to Redeem
        </p>
        <div className="flex flex-col gap-1.5">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            className="bg-transparent border-b border-[#EDE5E5] focus:border-[#2BA8B2] font-['Lora',serif] text-[#0D0D0D] text-2xl tracking-[8px] py-2 outline-none transition-colors"
          />
        </div>
      </div>

      {REWARDS.map((reward) => {
        const canAfford = total >= reward.points;
        return (
          <button
            key={reward.id}
            onClick={() => { setSelectedReward(reward.id); handleRedeem(reward.id); }}
            disabled={!canAfford || loading}
            className={`bg-white rounded-2xl border p-4 flex items-center justify-between text-left transition-all duration-200 ${
              canAfford
                ? "border-[#EDE5E5] hover:border-[#BA1C0A]/30 hover:shadow-[0_4px_20px_rgba(186,28,10,0.08)] cursor-pointer"
                : "border-[#EDE5E5] opacity-40 cursor-not-allowed"
            }`}
          >
            <div>
              <p className="font-['Charlotte',cursive] text-[#991001] text-base">{reward.name}</p>
              <p className="font-['Lora',serif] italic text-[#BA1C0A]/55 text-[0.75rem] mt-0.5">{reward.description}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className="font-['Pacifico',cursive] text-[#BA1C0A] text-xl">{reward.points}</p>
              <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] uppercase text-[#2BA8B2]">Sweets</p>
            </div>
          </button>
        );
      })}

      {error && <p className="font-['Jost',sans-serif] text-[0.65rem] tracking-wider text-[#BA1C0A] text-center">{error}</p>}
    </div>
  );
}

function TransactionHistory({ transactions }: { transactions: ProfileData["transactions"] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE5E5] p-8 text-center">
        <p className="font-['Lora',serif] italic text-[#BA1C0A]/40 text-sm">No transactions yet. Visit Sweetalks to earn your first Sweets!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5E5] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#EDE5E5]">
        <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[3px] uppercase text-[#2BA8B2]">
          Recent Activity
        </p>
      </div>
      <div className="divide-y divide-[#EDE5E5]">
        {transactions.slice(0, 10).map((t) => (
          <div key={t.id} className="px-5 py-3 flex items-center justify-between">
            <div>
              <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#BA1C0A]/60 mb-0.5">
                {t.reason}{t.bill_amount ? ` · ₹${Number(t.bill_amount).toFixed(0)}` : ""}
              </p>
              {t.note && <p className="font-['Lora',serif] italic text-[#BA1C0A]/35 text-[0.7rem]">{t.note}</p>}
              <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#BA1C0A]/25 mt-0.5">
                {new Date(t.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <p className={`font-['Pacifico',cursive] text-xl ${t.points >= 0 ? "text-[#2BA8B2]" : "text-[#BA1C0A]"}`}>
              {t.points >= 0 ? "+" : ""}{t.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
