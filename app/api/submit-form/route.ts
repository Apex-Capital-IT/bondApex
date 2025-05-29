import { NextResponse } from "next/server";
import { createBondRequest } from "@/app/models/BondRequest";
import { sendBondRequestEmail } from "@/app/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract bond information from the form data
    const {
      name,
      registration,
      email,
      phone,
      price,
      bondId,
      bondTitle,
      bondFeatures,
      bondImage,
    } = body;

    // Generate a unique ID for the request
    const id = crypto.randomUUID();

    // Extract nominal price and unit price from features if available
    let nominalPrice = body.nominalPrice;
    let unitPrice = body.unitPrice;

    if (bondFeatures && (!nominalPrice || !unitPrice)) {
      // Try to find them in the features
      const nominalFeature = bondFeatures.find((feature: string) =>
        feature.includes("Нэрлэсэн үнэ:")
      );
      const unitFeature = bondFeatures.find((feature: string) =>
        feature.includes("Нэгж үнэ:")
      );

      nominalPrice = nominalFeature || "N/A";
      unitPrice = unitFeature || "N/A";
    }

    const formData = {
      id,
      timestamp: new Date().toISOString(),
      status: "pending" as const,

      // Form data
      name,
      registration,
      email,
      phone,
      price,

      // Required by the BondRequest type
      userEmail: email, // Use the form email as the userEmail

      // Bond data
      bondId,
      bondTitle,
      bondFeatures,
      bondImage,
      nominalPrice,
      unitPrice,
    };

    // Save the form data using the same model as bond requests
    await createBondRequest(formData);

    // Send notification email to admin
    await sendBondRequestEmail(formData);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
