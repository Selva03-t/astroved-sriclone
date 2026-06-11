import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = process.env.ASTROVED_AUTH_API_TOKEN?.trim() || process.env.ASTROVED_API_TOKEN?.trim();

    if (!token) {
       console.error("Cart API Error: AstroVed Auth Token is missing in environment variables");
       return NextResponse.json({ StatusCode: 500, Status: "InternalServerError", Message: "AstroVed Auth Token is not configured" }, { status: 500 });
    }

    const response = await fetch('https://qawebservice.astroved.com/api/UserAccount/AddedItemsToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
       console.error("Cart API Error from Astroved:", response.status, data);
       return NextResponse.json({ StatusCode: response.status, Status: "Error", Message: typeof data === 'string' ? data : (data?.Message || "Failed to add item to Astroved cart") }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Cart API Exception:", error);
    return NextResponse.json({ StatusCode: 500, Status: "InternalServerError", Message: error.message }, { status: 500 });
  }
}
