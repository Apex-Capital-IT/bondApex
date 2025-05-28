import { NextResponse } from "next/server";
import { updateSaleRequest } from "@/app/models/SaleRequest";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PATCH request received:', {
      params,
      url: request.url
    });

    const { status, declineReason } = await request.json();
    const { id } = params;

    console.log('Request data:', {
      id,
      status,
      declineReason
    });

    if (!status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedRequest = await updateSaleRequest(id, {
      status,
      declineReason: status === "declined" ? declineReason : undefined,
    });

    console.log('Update result:', {
      success: !!updatedRequest,
      requestId: id
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