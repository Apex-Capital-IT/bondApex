import { NextResponse } from "next/server";
import { getCompanyRequests } from "@/app/models/CompanyRequest";

export async function GET() {
  try {
    const requests = await getCompanyRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch company requests" },
      { status: 500 }
    );
  }
}
