"use client";

import { useState } from "react";

export default function CreateStaffForm() {
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "staff" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/admin/create-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Failed to create account.");
      return;
    }

    setStatus("success");
    setMessage(`Account created: ${data.staff.email}`);
    setForm({ name: "", username: "", password: "", role: "staff" });
  };

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
      <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-5">
        Create Staff Account
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Riya Thomas"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors placeholder:text-white/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
              required
              placeholder="riya"
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors placeholder:text-white/20"
            />
            {form.username && (
              <p className="font-['Jost',sans-serif] text-[0.5rem] tracking-[1px] text-[#EDE5E5]/25">
                → {form.username}@sweetalks.in
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="bg-transparent border-b border-white/10 focus:border-[#2BA8B2] font-['Lora',serif] italic text-[#F8F2F2] text-sm py-2 outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/40">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="bg-[#0D0D0D] border-b border-white/10 focus:border-[#2BA8B2] font-['Jost',sans-serif] text-[0.65rem] tracking-[1px] uppercase text-[#F8F2F2] py-2 outline-none transition-colors"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
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
          className="self-start mt-1 px-6 py-3 bg-[#BA1C0A] hover:bg-[#991001] text-white rounded-full font-['Jost',sans-serif] text-[0.65rem] tracking-[2px] uppercase transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
        >
          {status === "loading" ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
