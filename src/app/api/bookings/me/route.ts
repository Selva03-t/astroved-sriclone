import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'astroved_secret_key_123'
);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('userToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'puja';

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('bookings');

    const bookings = await collection
      .find({ userId, bookingType: type })
      .sort({ bookingDate: -1 })
      .toArray();

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
