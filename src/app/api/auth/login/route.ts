import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { SignJWT } from "jose";
import type { EmailLoginPayload } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "divinealign_secret_key_123"
);

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as EmailLoginPayload;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if it's admin credentials
    const adminEmailEnv = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminPasswordEnv = process.env.ADMIN_PASSWORD || '';
    
    let isAdminMatch = false;
    const client = await clientPromise;
    const db = client.db();

    const adminDoc = await db.collection("admins").findOne({});

    if (normalizedEmail === adminEmailEnv && password === adminPasswordEnv) {
      isAdminMatch = true;
    } else if (adminDoc && adminDoc.email === normalizedEmail) {
      isAdminMatch = await bcrypt.compare(password, adminDoc.password);
    }

    if (isAdminMatch) {
      const token = await new SignJWT({ role: 'admin', email: normalizedEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true, isAdmin: true });
      
      response.cookies.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    // 2. Normal user login check
    const collection = db.collection("users");
    const user = await collection.findOne({ email: normalizedEmail });

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
