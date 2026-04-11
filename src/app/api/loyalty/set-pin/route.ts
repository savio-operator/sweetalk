import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { setPinSchema } from "@/lib/validations/loyalty";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // 1. Require authenticated customer session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // 2. Validate input
    const body = await request.json();
    const result = setPinSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { pin } = result.data;

    // 3. Hash PIN and store
    const pinHash = await bcrypt.hash(pin, 12);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ pin_hash: pinHash, pin_set: true })
      .eq("id", user.id);

    if (updateError) {
      console.error("[set-pin] DB error:", updateError.message);
      return NextResponse.json({ error: "Failed to save PIN." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-pin] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
