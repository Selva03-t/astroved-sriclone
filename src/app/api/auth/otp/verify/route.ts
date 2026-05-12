import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyStoredOtp } from "@/lib/server/authOtpStore";
import { SignJWT } from "jose";
import type { VerifyOtpPayload } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "astroved_secret_key_123"
);

export async function POST(request: Request) {
  try {
    const { method, country, number, otp } = (await request.json()) as VerifyOtpPayload;

    if (!method || !country || !number || !/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: "Enter the 6-digit OTP" }, { status: 400 });
    }

    const verified = verifyStoredOtp({ method, country, number }, otp);
    if (!verified) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");
    const numberField = method === "phone" ? "phone" : "whatsapp";
    const existing = await collection.findOne({
      [numberField]: number,
      "country.dialCode": country.dialCode,
    });

    const user =
      existing ??
      (
        await collection.insertOne({
          name: "AstroVed User",
          [numberField]: number,
          country,
          authProvider: method,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

    const userId = "insertedId" in user ? user.insertedId.toString() : user._id.toString();
    const userName = "insertedId" in user ? "AstroVed User" : user.name;

    const token = await new SignJWT({
      userId,
      name: userName,
      [numberField]: number,
      country,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const authUser = {
      id: userId,
      name: userName,
      phone: method === "phone" ? number : existing?.phone,
      whatsapp: method === "whatsapp" ? number : existing?.whatsapp,
      email: "insertedId" in user ? undefined : user.email,
      country,
    };

    const response = NextResponse.json({
      success: true,
      message: "OTP verified",
      user: authUser,
      data: authUser,
    });

    response.cookies.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Unable to verify OTP" }, { status: 500 });
  }
}
