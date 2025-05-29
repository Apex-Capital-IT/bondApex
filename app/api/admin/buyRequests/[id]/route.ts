import { NextRequest, NextResponse } from "next/server";
import { updateBondRequest, getBondRequest } from "@/app/models/BondRequest";
import { sendBondRequestStatusEmail } from "@/app/lib/email";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: requestId } = await context.params;
    const { status, declineReason } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const existingRequest = await getBondRequest(requestId);
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Bond request not found" },
        { status: 404 }
      );
    }

    const updatedRequest = await updateBondRequest(requestId, {
      status,
      declineReason,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Failed to update bond request" },
        { status: 500 }
      );
    }

    try {
      await sendBondRequestStatusEmail(
        updatedRequest,
        status as "accepted" | "declined",
        declineReason
      );
    } catch (emailError) {}

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update bond request" },
      { status: 500 }
    );
  }
}
