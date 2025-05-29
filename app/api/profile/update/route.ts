import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const userId = formData.get("userId") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const profileImage = formData.get("profileImage") as File | null;

    // Validate required fields
    if (!firstName || !lastName || !userId) {
      return NextResponse.json(
        { error: "Нэр болон хэрэглэгчийн ID шаардлагатай" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      firstName,
      lastName,
      email,
    };

    // Handle password change if provided
    if (currentPassword && newPassword) {
      if (currentPassword !== user.password) {
        return NextResponse.json(
          { error: "Одоогийн нууц үг буруу байна" },
          { status: 400 }
        );
      }
      updateData.password = newPassword;
    }

    // Handle profile image upload
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${userId}-${Date.now()}${path.extname(
        profileImage.name
      )}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filepath = path.join(uploadDir, filename);

      // Ensure upload directory exists
      await writeFile(filepath, buffer);

      // Update the profile image path
      updateData.profileImage = `/uploads/${filename}`;
    }

    // Update user
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Профайл шинэчлэхэд алдаа гарлаа" },
        { status: 400 }
      );
    }

    // Get updated user data
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
