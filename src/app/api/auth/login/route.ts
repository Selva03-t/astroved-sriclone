import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { SignJWT } from "jose";
import type { EmailLoginPayload } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "astroved_secret_key_123"
);

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as EmailLoginPayload;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: email.toLowerCase().trim() });

    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      whatsapp: user.whatsapp,
      country: user.country,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const authUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp,
      country: user.country,
    };

    const response = NextResponse.json({
      success: true,
      isAdmin: false,
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
    return NextResponse.json({ success: false, error: "Unable to log in" }, { status: 500 });
  }
}
