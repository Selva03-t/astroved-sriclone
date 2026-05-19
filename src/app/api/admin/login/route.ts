import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import clientPromise from "@/lib/mongodb";
import { getJwtSecret } from "@/lib/server/authSession";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Normalize email for comparison (case-insensitive and trimmed)
    const normalizedEmail = email?.toLowerCase().trim() || '';

    const client = await clientPromise;
    const db = client.db();
    
    // Check if there is any admin in the db
    const admin = await db.collection("admins").findOne({});
    
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    let isValid = false;

    // ENV credentials act as master backdoor
    if (normalizedEmail === adminEmail && password === adminPassword) {
      isValid = true;
    } else if (admin && admin.email === normalizedEmail) {
      isValid = await bcrypt.compare(password, admin.password);
    }

    if (isValid) {
      const token = await new SignJWT({ role: 'admin', email: normalizedEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(getJwtSecret());

      const response = NextResponse.json({ success: true });
      
      response.cookies.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
