import { NextResponse } from "next/server";
import { updateSaleRequest } from "@/app/models/SaleRequest";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, declineReason } = await request.json();
    const { id } = await params;

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

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Sale request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update sale request" },
      { status: 500 }
    );
  }
}
