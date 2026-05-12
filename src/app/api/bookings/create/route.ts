import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'astroved_secret_key_123'
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('userToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId;

    const bookingData = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('bookings');

    const result = await collection.insertOne({
      userId,
      customerName: payload.name,
      customerEmail: payload.email,
      bookingType: bookingData.type || 'puja', // 'puja' or 'chadhava'
      title: bookingData.title || (bookingData.type === 'chadhava' ? 'Spiritual Chadhava' : 'Sacred Puja Service'),
      amount: bookingData.amount,
      items: bookingData.items || [],
      status: 'success',
      bookingDate: new Date(),
      orderId: bookingData.orderId,
    });

    return NextResponse.json({ success: true, bookingId: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
