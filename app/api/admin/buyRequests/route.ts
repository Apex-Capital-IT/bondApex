import { NextResponse } from "next/server";
import { getBondRequests, clearBondRequests } from "@/app/models/BondRequest";

export async function GET() {
  try {
    const requests = await getBondRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearBondRequests();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear requests" },
      { status: 500 }
    );
  }
}
