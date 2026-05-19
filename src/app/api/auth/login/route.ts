import { NextResponse } from "next/server";
import type { EmailLoginPayload } from "@/types/auth";
import {
  AstrovedAuthError,
  authenticatePasswordLogin,
  mapLoginInfoToUser,
} from "@/lib/server/astrovedAuthApi";
import { attachUserSession } from "@/lib/server/authSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as EmailLoginPayload;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const loginInfo = await authenticatePasswordLogin({
      email: normalizedEmail,
      password,
    });
    const authUser = mapLoginInfoToUser(loginInfo, { loginProvider: "email" });

    const response = NextResponse.json({
      success: true,
      isAdmin: false,
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

    return NextResponse.json({ success: false, error: "Unable to log in" }, { status: 500 });
  }
}
