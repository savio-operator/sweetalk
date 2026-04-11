import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { reservationRateLimit } from "@/lib/rate-limit";
import { reservationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";

    const { success, limit, remaining, reset } = await reservationRateLimit.limit(
      ip
    );

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse and Validate
    const body = await request.json();
    const result = reservationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input.", details: result.error.format() },
        { status: 400 }
      );
    }

    // 3. Database Operation (Service Role)
    const { error } = await supabaseAdmin.from("reservations").insert({
      ...result.data,
      ip_address: ip,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit reservation. Please try again." },
        { status: 500 }
      );
    }

    // 4. Success
    return NextResponse.json({ success: true, message: "Reservation received." }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
