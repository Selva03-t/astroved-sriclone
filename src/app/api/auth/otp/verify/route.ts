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
    const body = await request.json();
    const { method, otp } = body;

    if (!method || !otp || !/^[0-9]{4,8}$/.test(String(otp).trim())) {
      return NextResponse.json({ success: false, error: "Enter the OTP sent to your number" }, { status: 400 });
    }

    let authUser;
    if (method === "email") {
      const email = String(body.email ?? "").toLowerCase().trim();
      if (!email) {
        return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
      }

      const loginInfo = await verifyOtpWithAstroved({ method, email, otp });
      authUser = mapLoginInfoToUser(loginInfo, { loginProvider: "email" });
    } else {
      const { country, number } = body;
      if (!country || !number) {
        return NextResponse.json({ success: false, error: "Country and number are required" }, { status: 400 });
      }

      const loginInfo = await verifyOtpWithAstroved({ method, country, number, otp });
      authUser = mapLoginInfoToUser(loginInfo, { country, loginProvider: method });
    }

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
      console.error("[otp-verify] AstrovedAuthError:", error.message, "status:", error.statusCode, "vendorStatus:", error.vendorStatus);
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }

    if (error instanceof Error && error.message.includes("JWT_SECRET")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.error("[otp-verify] Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Unable to verify OTP. Please try again." }, { status: 500 });
  }
}
