import { NextRequest, NextResponse } from 'next/server';
import { fetchPanchangData } from '@/lib/api/panchang';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const data = await fetchPanchangData({ date });
  return NextResponse.json(data);
}
