import { NextRequest, NextResponse } from 'next/server';
import { fetchPanchangData } from '@/lib/api/panchang';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  
  const latitude = latStr ? parseFloat(latStr) : undefined;
  const longitude = lonStr ? parseFloat(lonStr) : undefined;

  const data = await fetchPanchangData({ date, latitude, longitude });
  return NextResponse.json(data);
}
