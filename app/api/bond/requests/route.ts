import { NextResponse } from "next/server";
import { getBondRequests } from "@/app/models/BondRequest";

export async function GET() {
  try {
    const requests = await getBondRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bond requests" },
      { status: 500 }
    );
  }
}
