import { NextResponse } from "next/server";
import { createBondRequest } from "@/app/models/BondRequest";
import { sendBondRequestEmail } from "@/app/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userEmail) {
      return NextResponse.json(
        { error: "You must be logged in to make a bond request" },
        { status: 401 }
      );
    }

    // Generate a unique ID for the request
    const id = crypto.randomUUID();

    const bondRequest = {
      ...body,
      id,
      timestamp: new Date().toISOString(),
      status: "pending" as const,
    };

    await createBondRequest(bondRequest);
    await sendBondRequestEmail(bondRequest);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process bond request" },
      { status: 500 }
    );
  }
}
