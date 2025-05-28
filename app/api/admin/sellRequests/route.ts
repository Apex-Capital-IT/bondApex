import { NextResponse } from "next/server";
import { getSaleRequests, updateSaleRequest } from "@/app/models/saleRequest";

export async function GET() {
  try {
    const requests = await getSaleRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching sale requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale requests" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, declineReason } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedRequest = await updateSaleRequest(id, {
      status,
      declineReason: status === "declined" ? declineReason : undefined,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Sale request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating sale request:", error);
    return NextResponse.json(
      { error: "Failed to update sale request" },
      { status: 500 }
    );
  }
}