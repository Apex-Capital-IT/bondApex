import { NextResponse } from "next/server";
import { updateCompanyRequestStatus } from "@/app/models/CompanyRequest";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, declineReason } = body;

    const result = await updateCompanyRequestStatus(id, status, declineReason);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Company request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update company request" },
      { status: 500 }
    );
  }
}
