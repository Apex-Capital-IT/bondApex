import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json();

    // Validate input
    if (!email || !userId) {
      return NextResponse.json(
        { error: "И-мэйл хаяг болон хэрэглэгчийн ID шаардлагатай" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if email is already in use by another user
    const existingUser = await db.collection("users").findOne({
      email,
      _id: { $ne: new ObjectId(userId) }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing OTPs for this user
    await db.collection("otps").deleteMany({
      userId: new ObjectId(userId)
    });

    // Store OTP in database
    await db.collection("otps").insertOne({
      email,
      userId: new ObjectId(userId),
      otp,
      expiry: otpExpiry,
      createdAt: new Date()
    });

    // Configure nodemailer with Office 365 SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    try {
      await transporter.sendMail({
        from: "info@apex.mn",
        to: email,
        subject: "И-мэйл хаяг баталгаажуулах код",
        text: `Таны и-мэйл хаяг баталгаажуулах код: ${otp}`,
        html: `
          <div>
            <h2>И-мэйл хаяг баталгаажуулах код</h2>
            <p>Таны и-мэйл хаяг баталгаажуулах код: <strong>${otp}</strong></p>
            <p>Энэ код 10 минутын дараа хүчингүй болно.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "И-мэйл илгээхэд алдаа гарлаа" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Баталгаажуулах код илгээгдлээ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа" },
      { status: 500 }
    );
  }
} 