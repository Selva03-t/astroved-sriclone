import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, customerId, shoppingCartId, contactId } = await request.json();
    const rawBaseUrl = process.env.ASTROVED_PAYMENT_API_URL || 'https://qawebservice.astroved.com/api/UserAccount/ProceedviaRazorPay';
    const token = process.env.ASTROVED_AUTH_API_TOKEN?.trim() || process.env.ASTROVED_API_TOKEN?.trim();

    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      request.headers.get('x-real-ip') || 
                      '192.168.20.96';

    const response = await fetch(rawBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        customerId: Number(customerId) || 1145090,
        currencyCode: "INR",
        ipAddress: ipAddress,
        shoppingCartId: Number(shoppingCartId) || 0,
        totalamount: Number(amount) || 0,
        contactId: Number(contactId) || Number(customerId) || 1145090,
        localeId: 1,
        trackingCode1: "GOOGLE_CAMPAIGN",
        trackingCode2: "SUMMER_SALE",
        shippingpreferred: false
      })
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
