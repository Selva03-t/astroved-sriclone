import { NextResponse } from "next/server";
import type { VerifyOtpPayload } from "@/types/auth";
import {
  AstrovedAuthError,
  mapLoginInfoToUser,
  verifyOtpWithAstroved,
} from "@/lib/server/astrovedAuthApi";
import { attachUserSession } from "@/lib/server/authSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { method, country, number, otp } = (await request.json()) as VerifyOtpPayload;

    if (!method || !country || !number || !/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: "Enter the 6-digit OTP" }, { status: 400 });
    }

    const loginInfo = await verifyOtpWithAstroved({ method, country, number, otp });
    const authUser = mapLoginInfoToUser(loginInfo, { country, loginProvider: method });

    const response = NextResponse.json({
      success: true,
      message: "OTP verified",
      user: authUser,
      data: authUser,
    });

    await attachUserSession(response, authUser);

    return response;
  } catch (error) {
    if (error instanceof AstrovedAuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }

    if (error instanceof Error && error.message.includes("JWT_SECRET")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: "Unable to verify OTP" }, { status: 500 });
  }
}
