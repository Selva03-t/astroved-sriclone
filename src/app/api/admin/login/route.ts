import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'astroved_secret_key_123'
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Normalize email for comparison (case-insensitive and trimmed)
    const normalizedEmail = email?.toLowerCase().trim() || '';

    const client = await clientPromise;
    const db = client.db();
    
    // Check if there is any admin in the db
    const admin = await db.collection("admins").findOne({});
    
    let isValid = false;

    if (admin) {
      if (admin.email === normalizedEmail) {
        isValid = await bcrypt.compare(password, admin.password);
      }
    } else {
      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || '';
      if (normalizedEmail === adminEmail && password === adminPassword) {
        isValid = true;
      }
    }

    if (isValid) {
      const token = await new SignJWT({ role: 'admin', email: normalizedEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

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
