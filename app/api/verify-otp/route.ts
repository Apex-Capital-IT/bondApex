import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Бүх талбарыг бөглөнө үү" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Find password reset record
    const resetRecord = await db.collection("password_resets").findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Баталгаажуулах код буруу эсвэл хугацаа нь дууссан байна" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Баталгаажуулалт амжилттай" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
