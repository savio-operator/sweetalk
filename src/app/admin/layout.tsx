import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
      {/* Admin nav */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-['Pacifico',cursive] text-[#BA1C0A] text-lg">Sweetalks</span>
            <span className="text-[#74C0C6] font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <AdminNavLinks role={profile.role} />
            <span className="text-[#EDE5E5]/40 font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase">
              {profile.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function AdminNavLinks({ role }: { role: string }) {
  const links = [
    { href: "/admin/earn",      label: "Earn"      },
    { href: "/admin/redeem",    label: "Redeem"    },
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/customers", label: "Customers" },
    ...(role === "admin" ? [
      { href: "/admin/staff",    label: "Staff"    },
      { href: "/admin/reports",  label: "Reports"  },
      { href: "/admin/broadcast",label: "Broadcast"},
    ] : []),
  ];

  return (
    <div className="hidden md:flex items-center gap-1">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="px-3 py-1.5 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#EDE5E5]/50 hover:text-[#2BA8B2] hover:bg-white/5 transition-all duration-200"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="px-3 py-1.5 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#BA1C0A] border border-[#BA1C0A]/30 hover:bg-[#BA1C0A]/10 transition-all duration-200"
      >
        Sign Out
      </button>
    </form>
  );
}
