import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CreateStaffForm from "./CreateStaffForm";

export const revalidate = 0;

export default async function StaffPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/admin/dashboard");

  const { data: staffList } = await supabaseAdmin
    .from("profiles")
    .select("id, name, phone, role, created_at")
    .in("role", ["staff", "admin"])
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6] mb-2">Management</p>
        <h1 className="font-['Pacifico',cursive] text-[#F8F2F2] text-3xl">Staff Accounts</h1>
      </div>

      {/* Existing staff */}
      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/8">
          <p className="font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase text-[#74C0C6]">
            Current Accounts
          </p>
        </div>
        {!staffList || staffList.length === 0 ? (
          <div className="p-8 text-center font-['Lora',serif] italic text-[#EDE5E5]/30">No staff accounts yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {staffList.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-['Lora',serif] italic text-[#F8F2F2] text-sm">{s.name}</p>
                  <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[1px] text-[#EDE5E5]/40 mt-0.5">
                    {s.phone.replace("@sweetalks.in", "")} · joined {new Date(s.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase px-3 py-1 rounded-full" style={{
                  background: s.role === "admin" ? "rgba(186,28,10,0.15)" : "rgba(43,168,178,0.12)",
                  color: s.role === "admin" ? "#BA1C0A" : "#2BA8B2",
                  border: `1px solid ${s.role === "admin" ? "rgba(186,28,10,0.25)" : "rgba(43,168,178,0.2)"}`,
                }}>
                  {s.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create new */}
      <CreateStaffForm />
    </div>
  );
}
