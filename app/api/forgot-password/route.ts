import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг оруулна уу" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Find user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "И-мэйл хаяг олдсонгүй" },
        { status: 404 }
      );
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in database with expiration (5 minutes)
    await db.collection("password_resets").insertOne({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
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
        subject: "Нууц үг сэргээх код",
        text: `Таны нууц үг сэргээх код: ${otp}`,
        html: `
          <div>
            <h2>Нууц үг сэргээх код</h2>
            <p>Таны нууц үг сэргээх код: <strong>${otp}</strong></p>
            <p>Энэ код 5 минутын дараа хүчингүй болно.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Баталгаажуулах код илгээгдлээ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа" },
      { status: 500 }
    );
  }
} 