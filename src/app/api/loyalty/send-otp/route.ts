import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { otpRateLimit } from "@/lib/rate-limit";
import { otpRequestSchema } from "@/lib/validations/loyalty";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit by phone (extracted after validation)
    const body = await request.json();
    const result = otpRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone } = result.data;
    const normalized = phone.replace(/\D/g, "");
    const key = `phone:${normalized}`;

    const { success } = await otpRateLimit.limit(key);
    if (!success) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait an hour and try again." },
        { status: 429 }
      );
    }

    // 2. Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3. Store OTP (invalidate previous ones for this phone)
    await supabaseAdmin
      .from("otp_requests")
      .update({ verified: true }) // mark old ones as used
      .eq("phone", normalized)
      .eq("verified", false);

    const { error: insertError } = await supabaseAdmin
      .from("otp_requests")
      .insert({
        phone: normalized,
        code_hash: codeHash,
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempts: 0,
      });

    if (insertError) {
      console.error("[send-otp] DB error:", insertError.message);
      return NextResponse.json({ error: "Failed to generate OTP." }, { status: 500 });
    }

    // 4. Send via WhatsApp server (if configured)
    const waUrl = process.env.WA_SERVER_URL;
    const waSecret = process.env.WA_SERVER_SECRET;
    if (waUrl && waSecret) {
      const to = normalized.length === 10 ? `91${normalized}` : normalized;
      let waOk = false;
      try {
        const waRes = await fetch(`${waUrl}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${waSecret}`,
          },
          body: JSON.stringify({
            to,
            message: `Your Sweet Circle OTP is *${otp}*. Valid for 5 minutes.\n\nNever share this code with anyone.`,
          }),
        });
        waOk = waRes.ok;
        if (!waOk) {
          console.error("[send-otp] WhatsApp server responded:", waRes.status, await waRes.text());
        }
      } catch (err) {
        console.error("[send-otp] WhatsApp send failed:", err);
      }
      if (!waOk) {
        return NextResponse.json(
          { error: "WhatsApp delivery failed. Please try again or contact staff." },
          { status: 503 }
        );
      }
    } else {
      // Dev mode: log OTP to console
      console.info(`[DEV] OTP for ${normalized}: ${otp}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent." });
  } catch (err) {
    console.error("[send-otp] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
