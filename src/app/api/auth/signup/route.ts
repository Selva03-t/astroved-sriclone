import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{6,15}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, country, isWhatsappNumber, password, confirmPassword } = body;

    const name = `${firstName || ""} ${lastName || ""}`.trim();

    if (!firstName?.trim()) {
      return NextResponse.json({ success: false, error: "First name is required" }, { status: 400 });
    }

    if (!emailRegex.test(String(email ?? "").toLowerCase().trim())) {
      return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 });
    }

    if (!country?.dialCode || !country?.isoCode || !country?.name) {
      return NextResponse.json({ success: false, error: "Select a country" }, { status: 400 });
    }

    if (country.isoCode.toUpperCase() === 'IN') {
      const indianPhoneRegex = /^[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(phone)) {
        return NextResponse.json({ success: false, error: "Enter a valid 10-digit Indian mobile number starting with 6-9" }, { status: 400 });
      }
    } else {
      if (!phoneRegex.test(phone)) {
        return NextResponse.json({ success: false, error: "Enter a valid mobile number" }, { status: 400 });
      }
    }

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters and include a letter and a number" },
        { status: 400 }
      );
    }

    // Call external Registration API
    const formattedPhone = `${country.dialCode}|${phone}`;
    const apiUrl = process.env.REGISTRATION_API_URL || "";
    
    if (apiUrl) {
      try {
        const externalRes = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstName: firstName,
            LastName: lastName,
            UserName: email,
            Password: password,
            PhoneNumber: formattedPhone,
            ShopName: "DivineAlign",
            Currency: "INR",
            IsWhatsappNumber: Boolean(isWhatsappNumber)
          })
        });
        
        const externalData = await externalRes.json();
        
        if (externalData.ErrorMessage) {
          return NextResponse.json({ success: false, error: externalData.ErrorMessage }, { status: 400 });
        }
      } catch (err) {
        console.error("External API Registration Error:", err);
        // Depending on requirements, we might want to return an error here, but for now we proceed if the external call fails
      }
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await collection.findOne({
      $or: [
        { email: normalizedEmail },
        { phone, "country.dialCode": country.dialCode },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account already exists with this email or number" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await collection.insertOne({
      name,
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      whatsapp: isWhatsappNumber ? phone : "",
      country,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: { userId: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Unable to create account" }, { status: 500 });
  }
}
