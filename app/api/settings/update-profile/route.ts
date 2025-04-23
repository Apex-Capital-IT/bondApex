import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const profileImage = formData.get("profileImage") as File | null;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Find user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    // Update object
    const updateData: any = {
      username: name,
    };

    // Handle password change
    if (currentPassword) {
      if (currentPassword !== user.password) {
        return NextResponse.json(
          { error: "Одоогийн нууц үг буруу байна" },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Шинэ нууц үг таарахгүй байна" },
          { status: 400 }
        );
      }

      updateData.password = newPassword;
    }

    // Handle profile image
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${user._id}-${Date.now()}-${profileImage.name}`;
      const path = join(process.cwd(), "public/uploads", filename);

      // Save file
      await writeFile(path, buffer);
      updateData.profileImage = `/uploads/${filename}`;
    }

    // Update user
    await db.collection("users").updateOne(
      { email },
      { $set: updateData }
    );

    return NextResponse.json(
      { message: "Профайл амжилттай шинэчлэгдлээ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа" },
      { status: 500 }
    );
  }
} 