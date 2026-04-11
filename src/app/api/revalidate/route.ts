import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
     // 1. Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";

    const { success } = await revalidateRateLimit.limit(ip);

    if (!success) {
       return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    if (body.secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidatePath("/blog");
    revalidateTag("posts", {});

    return NextResponse.json({ revalidated: true, now: Date.now() }, { status: 200 });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
