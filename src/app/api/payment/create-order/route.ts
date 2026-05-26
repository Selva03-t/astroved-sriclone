import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, customerId } = await request.json();
    const baseUrl = process.env.ASTROVED_PAYMENT_API_URL || 'https://qawebservice.astroved.com/api/UserAccount/ProceedviaRazorPay';
    const url = `${baseUrl}?totalAmount=${amount}&customerId=${customerId}`;
    
    const token = process.env.ASTROVED_AUTH_API_TOKEN?.trim() || process.env.ASTROVED_API_TOKEN?.trim();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok || data === "Unauthorized Request") {
       console.error("Astroved API Error:", response.status, data);
       return NextResponse.json({ error: data === "Unauthorized Request" || response.status === 401 ? "AstroVed API Token Expired or Unauthorized" : "Failed to create order from Astroved API" }, { status: 400 });
    }

    if (data && data.Msg && data.Status) {
       return NextResponse.json({
          orderId: data.Msg,
          shoppingCartId: data.Status
       });
    } else {
       return NextResponse.json({ error: "Failed to create order from Astroved API" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
