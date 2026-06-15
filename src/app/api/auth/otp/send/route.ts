import { NextResponse } from "next/server";
import { AstrovedAuthError, requestOtp, registerWithAstroved } from "@/lib/server/astrovedAuthApi";
import type { OtpPayload } from "@/types/auth";

const phoneRegex = /^[0-9]{6,15}$/;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as any;

    // 1. Validate payload
    if (payload.method === "email") {
      const email = String(payload.email ?? "").toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 });
      }
      payload.email = email; // Normalize
    } else {
      if (!payload.method || !payload.country || !phoneRegex.test(payload.number)) {
        return NextResponse.json({ success: false, error: "Enter a valid number" }, { status: 400 });
      }
    }

    let responseData;
    
    // 2. Attempt to request OTP. 
    // AstroVed rejects OTP requests if the user is not registered in their DB.
    try {
      responseData = await requestOtp(payload);
    } catch (error) {
      // 3. If user is rejected (not found/unauthorized), attempt Silent Auto-Registration
      if (error instanceof AstrovedAuthError) {
        console.log("[otp-send] User likely not registered. Attempting silent registration...");
        
        try {
          const generatedPassword = Math.random().toString(36).slice(-10) + "A1@";
          
          if (payload.method === "email") {
            await registerWithAstroved({
              firstName: "AstroVed",
              lastName: "Guest",
              email: payload.email,
              password: generatedPassword,
              phone: "9999999999", // Fallback for email-only signups
              country: { code: "IN", dialCode: "+91", name: "India" } as any,
              isWhatsappNumber: false,
              currency: "INR"
            });
          } else {
            await registerWithAstroved({
              firstName: "AstroVed",
              lastName: "Guest",
              email: `guest_${payload.number}@astroved.com`, // Auto-generated email
              password: generatedPassword,
              phone: payload.number,
              country: payload.country,
              isWhatsappNumber: payload.method === "whatsapp",
              currency: "INR"
            });
          }

          // 4. Registration succeeded! Now request the OTP again.
          console.log("[otp-send] Silent registration successful. Retrying OTP...");
          responseData = await requestOtp(payload);
          
        } catch (regError) {
          console.error("[otp-send] Silent registration failed:", regError);
          // Throw the ORIGINAL error so the UI shows "Unauthorized" or whatever the original issue was
          throw error; 
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: responseData.message,
      data: { expiresIn: 30 },
    });
    
  } catch (error) {
    if (error instanceof AstrovedAuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ success: false, error: "Unable to send OTP" }, { status: 500 });
  }
}
