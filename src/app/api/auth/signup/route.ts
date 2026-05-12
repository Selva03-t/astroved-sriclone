import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import type { SignupPayload } from "@/types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{6,15}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const { name, email, phone, whatsapp, country, password, confirmPassword } = (await request.json()) as SignupPayload;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Full name is required" }, { status: 400 });
    }

    if (!emailRegex.test(String(email ?? "").toLowerCase().trim())) {
      return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 });
    }

    if (!country?.dialCode || !country?.isoCode || !country?.name) {
      return NextResponse.json({ success: false, error: "Select a country" }, { status: 400 });
    }

    if (!phoneRegex.test(phone) || !phoneRegex.test(whatsapp)) {
      return NextResponse.json({ success: false, error: "Enter valid phone and WhatsApp numbers" }, { status: 400 });
    } 

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters and include a letter and a number" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await collection.findOne({
      $or: [
        { email: normalizedEmail },
        { phone, "country.dialCode": country.dialCode },
        { whatsapp, "country.dialCode": country.dialCode },
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
      name: name.trim(),
      email: normalizedEmail,
      phone,
      whatsapp,
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
  } catch {
    return NextResponse.json({ success: false, error: "Unable to create account" }, { status: 500 });
  }
}
