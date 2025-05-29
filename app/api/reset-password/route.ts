import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    // Validate input
    if (!email || !otp || !newPassword) {
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

    // Update user's password
    await db
      .collection("users")
      .updateOne({ email }, { $set: { password: newPassword } });

    // Delete used reset record
    await db.collection("password_resets").deleteOne({ _id: resetRecord._id });

    return NextResponse.json(
      { message: "Нууц үг амжилттай сэргээгдлээ" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
