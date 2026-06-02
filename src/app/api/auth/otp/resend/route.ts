import { NextResponse } from "next/server";
import { AstrovedAuthError, resendOtpWithAstroved } from "@/lib/server/astrovedAuthApi";
import type { OtpPayload } from "@/types/auth";

const phoneRegex = /^[0-9]{6,15}$/;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as any;

    if (payload.method === "email") {
      const email = String(payload.email ?? "").toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 });
      }

      const data = await resendOtpWithAstroved({
        method: "email",
        email,
      });

      return NextResponse.json({
        success: true,
        message: data.message,
        data: { expiresIn: 30 },
      });
    }

    if (!payload.method || !payload.country || !phoneRegex.test(payload.number)) {
      return NextResponse.json({ success: false, error: "Enter a valid number" }, { status: 400 });
    }

    const data = await resendOtpWithAstroved(payload);

    return NextResponse.json({
      success: true,
      message: data.message,
      data: { expiresIn: 30 },
    });
  } catch (error) {
    if (error instanceof AstrovedAuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ success: false, error: "Unable to resend OTP" }, { status: 500 });
  }
}
