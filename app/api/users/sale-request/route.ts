import { NextResponse } from "next/server";
import { createSaleRequest, updateSaleRequest } from "@/app/models/SaleRequest";
import { getBondRequest, updateBondRequest } from "@/app/models/BondRequest";
import clientPromise from "@/app/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bondId, userEmail, originalPrice } = body;

    if (!bondId || !userEmail || !originalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the existing bond request using bondId and userEmail
    const client = await clientPromise;
    const db = client.db();
    const bondRequest = await db.collection("bondRequests").findOne({
      bondId,
      userEmail,
    });

    if (!bondRequest) {
      return NextResponse.json(
        { error: "Bond request not found" },
        { status: 404 }
      );
    }

    // Extract interest rate from bond features
    const features = bondRequest.bondFeatures || bondRequest.features || [];
    const interestRateFeature = features.find((f: string) =>
      f.includes("хүүтэй")
    );
    const annualInterestRate = interestRateFeature
      ? Number(interestRateFeature.match(/(\d+(?:\.\d+)?)/)?.[1] || "19") / 100
      : 0.19;

    // Create the sale request
    const saleRequest = await createSaleRequest(
      bondRequest.id,
      bondId,
      userEmail,
      originalPrice,
      bondRequest.timestamp,
      annualInterestRate
    );

    if (!saleRequest) {
      return NextResponse.json(
        { error: "Failed to create sale request" },
        { status: 500 }
      );
    }

    // Update the bond request's saleRequest status
    await updateBondRequest(bondRequest.id, {
      saleRequest: {
        status: "pending",
        timestamp: saleRequest.timestamp,
      },
    });

    return NextResponse.json(saleRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create sale request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the sale request
    const updatedSaleRequest = await updateSaleRequest(id, {
      status,
      timestamp: new Date().toISOString(),
    });

    if (!updatedSaleRequest) {
      return NextResponse.json(
        { error: "Failed to update sale request" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedSaleRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update sale request" },
      { status: 500 }
    );
  }
}
