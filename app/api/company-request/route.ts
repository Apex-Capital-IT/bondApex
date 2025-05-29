import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, dugaar } = await request.json();

    // Validate input
    if (!email || !dugaar) {
      return NextResponse.json(
        { error: "И-мэйл хаяг болон дугаар шаардлагатай" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if company already exists
    const existingCompany = await db.collection("companyRequests").findOne({
      $or: [{ email }, { dugaar }],
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Энэ и-мэйл хаяг эсвэл дугаар аль хэдийн бүртгэгдсэн байна" },
        { status: 400 }
      );
    }

    // Create company request
    const result = await db.collection("companyRequests").insertOne({
      email,
      dugaar,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Байгууллагын хүсэлт амжилттай илгээгдлээ",
        requestId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
