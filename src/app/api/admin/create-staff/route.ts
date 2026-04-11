import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createStaffSchema } from "@/lib/validations/loyalty";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth — admin only
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    // 2. Validate
    const body = await request.json();
    const result = createStaffSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, username, password, role } = result.data;
    const email = `${username}@sweetalks.in`;

    // 3. Create Supabase auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (createError) {
      if (createError.message.includes("already")) {
        return NextResponse.json({ error: "Username already exists." }, { status: 409 });
      }
      console.error("[create-staff] Auth error:", createError.message);
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    // 4. Upsert profile with staff role
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: newUser.user.id,
      phone: email, // staff accounts use email as phone placeholder
      name,
      role,
      referral_code: null,
    });

    if (profileError) {
      // Cleanup auth user if profile fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      console.error("[create-staff] Profile error:", profileError.message);
      return NextResponse.json({ error: "Failed to create staff profile." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      staff: { id: newUser.user.id, name, email, role },
    });
  } catch (err) {
    console.error("[create-staff] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

// DELETE: revoke staff account
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { staff_id } = await request.json();
    if (!staff_id) return NextResponse.json({ error: "staff_id required." }, { status: 400 });

    // Prevent deleting self
    if (staff_id === user.id) {
      return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
    }

    await supabaseAdmin.auth.admin.deleteUser(staff_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[delete-staff] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
