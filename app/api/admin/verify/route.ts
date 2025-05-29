import { NextResponse } from "next/server";

// This should be stored in a secure environment variable in production
const ADMIN_CODE = process.env.ADMIN_CODE || "";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!ADMIN_CODE) {
      return NextResponse.json(
        { error: "Admin code not configured" },
        { status: 500 }
      );
    }

    if (code === ADMIN_CODE) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid security code" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!ADMIN_CODE) {
      return NextResponse.json(
        { error: "Admin code not configured" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
