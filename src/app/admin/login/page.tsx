"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = username.includes("@") ? username : `${username}@sweetalks.in`;
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin/earn");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-['Pacifico',cursive] text-[#BA1C0A] text-3xl mb-2">Sweetalks</h1>
          <p className="font-['Jost',sans-serif] text-[0.6rem] tracking-[3px] uppercase text-[#74C0C6]">
            Sweet Circle Admin
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="bibin"
                className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200 placeholder:text-white/20"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#EDE5E5]/40">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors duration-200"
              />
            </div>

            {error && (
              <p className="font-['Jost',sans-serif] text-[0.7rem] tracking-wider text-[#BA1C0A]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.7rem] tracking-[2px] uppercase py-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 font-['Jost',sans-serif] text-[0.55rem] tracking-[1px] uppercase text-[#EDE5E5]/20">
          Sweetalks Thrikkakara · Staff Only
        </p>
      </div>
    </div>
  );
}
