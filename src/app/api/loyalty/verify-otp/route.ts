import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { otpVerifySchema } from "@/lib/validations/loyalty";
import { notifyWelcome } from "@/lib/loyalty/whatsapp";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = otpVerifySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone, otp } = result.data;
    const normalized = phone.replace(/\D/g, "");

    // 1. Find most recent unverified OTP for this phone
    const { data: otpRow, error: fetchError } = await supabaseAdmin
      .from("otp_requests")
      .select("id, code_hash, expires_at, attempts")
      .eq("phone", normalized)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRow) {
      return NextResponse.json(
        { error: "OTP not found or already used. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Check expiry
    if (new Date(otpRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // 3. Check max attempts (5)
    if (otpRow.attempts >= 5) {
      return NextResponse.json({ error: "Too many incorrect attempts. Request a new OTP." }, { status: 429 });
    }

    // 4. Verify code
    const valid = await bcrypt.compare(otp, otpRow.code_hash);
    if (!valid) {
      await supabaseAdmin
        .from("otp_requests")
        .update({ attempts: otpRow.attempts + 1 })
        .eq("id", otpRow.id);
      return NextResponse.json({ error: "Incorrect OTP." }, { status: 400 });
    }

    // 5. Mark OTP verified
    await supabaseAdmin.from("otp_requests").update({ verified: true }).eq("id", otpRow.id);

    // 6. Find or create Supabase Auth user
    // Use a stable email alias: <phone>@sweetalks.loyalty
    const email = `${normalized}@sweetalks.loyalty`;
    const name = body.name as string | undefined;

    let userId: string;
    let isNewUser = false;

    // Look up by querying profiles table (phone → profile.id → auth user)
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("phone", normalized)
      .single();

    if (existingProfile?.id) {
      userId = existingProfile.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { phone: normalized, name: name ?? "" },
      });
      if (createError || !newUser.user) {
        console.error("[verify-otp] Create user error:", createError?.message);
        return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
      }
      userId = newUser.user.id;
      isNewUser = true;
    }

    // 7. Ensure profile exists
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, pin_set, referral_code, name")
      .eq("id", userId)
      .single();

    if (!profile) {
      // Trigger didn't fire — upsert manually
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        phone: normalized,
        name: name ?? "",
        role: "customer",
        referral_code: referralCode,
      });
    }

    // 8. Grant signup bonus if new user
    if (isNewUser) {
      await supabaseAdmin.from("points_ledger").insert({
        customer_id: userId,
        points: 50,
        reason: "signup",
        note: "Welcome bonus",
      });

      const { data: p } = await supabaseAdmin
        .from("profiles")
        .select("referral_code")
        .eq("id", userId)
        .single();

      await notifyWelcome(normalized, name ?? "there", p?.referral_code ?? "");
    }

    // 9. Create short-lived Supabase session via magic link token flow
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (linkError || !linkData) {
      console.error("[verify-otp] generateLink error:", linkError?.message);
      return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
    }

    const { data: profile2 } = await supabaseAdmin
      .from("profiles")
      .select("pin_set, referral_code, name")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      success: true,
      pin_set: profile2?.pin_set ?? false,
      is_new_user: isNewUser,
      // Client calls supabase.auth.verifyOtp({ token_hash, type: 'email' }) to get session
      token_hash: linkData.properties?.hashed_token ?? null,
    });
  } catch (err) {
    console.error("[verify-otp] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
