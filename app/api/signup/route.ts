import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/email";

// POST: /api/signup
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Then destructure as before
    const { firstName, lastName, email, password } = body;
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingEmail = await db.collection("users").findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection("otps").insertOne({
      email,
      otp,
      expiry: otpExpiry,
      createdAt: new Date(),
    });

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    // REMOVE USERNAME, ONLY STORE FIRST/LAST NAME
    await db.collection("pending_users").insertOne({
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// (PUT stays the same as previously revised)
// PUT: /api/signup
export async function PUT(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const otpRecord = await db.collection("otps").findOne({
      email,
      otp,
      expiry: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const pendingUser = await db.collection("pending_users").findOne({ email });

    if (!pendingUser) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 400 }
      );
    }

    // NO username
    const result = await db.collection("users").insertOne({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      password: pendingUser.password,
      createdAt: new Date(),
    });

    await db.collection("otps").deleteOne({ _id: otpRecord._id });
    await db.collection("pending_users").deleteOne({ _id: pendingUser._id });

    return NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
