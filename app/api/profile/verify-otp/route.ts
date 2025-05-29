import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { email, otp, userId } = await request.json();

    // Validate input
    if (!email || !otp || !userId) {
      return NextResponse.json(
        {
          error:
            "И-мэйл хаяг, баталгаажуулах код болон хэрэглэгчийн ID шаардлагатай",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Find and verify OTP
    const otpRecord = await db.collection("otps").findOne({
      email,
      userId: new ObjectId(userId),
      otp,
      expiry: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Баталгаажуулах код буруу эсвэл хугацаа нь дууссан байна" },
        { status: 400 }
      );
    }

    // Update user's email
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { email } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 400 }
      );
    }

    // Delete the used OTP
    await db.collection("otps").deleteOne({ _id: otpRecord._id });

    // Get updated user data
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    return NextResponse.json(
      {
        message: "И-мэйл хаяг амжилттай шинэчлэгдлээ",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
