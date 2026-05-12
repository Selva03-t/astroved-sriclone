import { NextResponse } from "next/server";
import { createOtp } from "@/lib/server/authOtpStore";
import type { OtpPayload } from "@/types/auth";

const phoneRegex = /^[0-9]{6,15}$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OtpPayload;

    if (!payload.method || !payload.country || !phoneRegex.test(payload.number)) {
      return NextResponse.json({ success: false, error: "Enter a valid number" }, { status: 400 });
    }

    const data = await createOtp(payload);

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
      data,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to resend OTP" }, { status: 500 });
  }
}
