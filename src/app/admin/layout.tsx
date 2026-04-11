import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminNav from "./AdminNav";

export const metadata = { title: "Sweetalks Admin — Sweet Circle" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Unauthenticated → login
  if (!user) redirect("/admin/login");

  // Check role
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (!profile || !["staff", "admin"].includes(profile.role)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F2F2]">
      <AdminNav role={profile.role} name={profile.name} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
