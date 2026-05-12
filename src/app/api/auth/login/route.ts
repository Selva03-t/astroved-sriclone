import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'astroved_secret_key_123'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Check if it's Admin
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@astroved.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'astroved_admin_2026';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
       // Create Admin JWT
       const token = await new SignJWT({ role: 'admin', email: ADMIN_EMAIL })
         .setProtectedHeader({ alg: 'HS256' })
         .setIssuedAt()
         .setExpirationTime('1d')
         .sign(JWT_SECRET);

       const response = NextResponse.json({ 
          success: true, 
          isAdmin: true,
          user: { name: 'AstroVed Admin', email: ADMIN_EMAIL } 
       });

       response.cookies.set('adminToken', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 60 * 60 * 24, // 1 day
         path: '/',
       });

       return response;
    }

    // 2. Regular User check
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    const user = await collection.findOne({ email, password });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create User JWT
    const token = await new SignJWT({ userId: user._id, email: user.email, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ 
       success: true, 
       isAdmin: false,
       user: { id: user._id, name: user.name, email: user.email } 
    });

    // Set cookie
    response.cookies.set('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
