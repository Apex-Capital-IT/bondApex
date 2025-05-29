import clientPromise from "@/app/lib/mongodb";
import { ObjectId, WithId, Document } from "mongodb";

export interface BondRequest {
  _id?: ObjectId;
  id: string;
  bondId: string;
  bondTitle: string;
  features?: string[];
  bondFeatures?: string[];
  nominalPrice?: string;
  unitPrice?: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
  saleRequest?: {
    status: "pending" | "accepted" | "normal";
    timestamp?: string;
  };
  declineReason?: string;
  userEmail: string;

  name?: string;
  registration?: string;
  phone?: string;
  price?: string;
  bondImage?: string;
}

export async function createBondRequest(request: BondRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("bondRequests").insertOne(request);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getBondRequest(id: string): Promise<BondRequest | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const request = await db
      .collection<BondRequest>("bondRequests")
      .findOne({ id });
    return request;
  } catch (error) {
    throw error;
  }
}

export async function getBondRequests(): Promise<BondRequest[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const requests = await db
      .collection<BondRequest>("bondRequests")
      .find()
      .sort({ timestamp: -1 }) // Sort by newest first
      .toArray();
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function clearBondRequests() {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("bondRequests").deleteMany({});
    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateBondRequest(
  id: string,
  update: Partial<BondRequest>
): Promise<BondRequest | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db
      .collection<BondRequest>("bondRequests")
      .updateOne({ id }, { $set: update });

    // Get the updated document
    const updatedDoc = await db
      .collection<BondRequest>("bondRequests")
      .findOne({ id });
    return updatedDoc;
  } catch (error) {
    throw error;
  }
}

export async function createSaleRequest(
  bondId: string,
  userEmail: string
): Promise<BondRequest | null> {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Find the existing bond request
    const existingRequest = await db
      .collection<BondRequest>("bondRequests")
      .findOne({
        bondId,
        userEmail,
      });

    if (!existingRequest) {
      throw new Error("Bond request not found");
    }

    // Update the bond request with sale request
    const update = {
      saleRequest: {
        status: "pending" as const,
        timestamp: new Date().toISOString(),
      },
    };

    await db
      .collection<BondRequest>("bondRequests")
      .updateOne({ bondId, userEmail }, { $set: update });

    // Get the updated document
    const updatedDoc = await db
      .collection<BondRequest>("bondRequests")
      .findOne({
        bondId,
        userEmail,
      });

    return updatedDoc;
  } catch (error) {
    throw error;
  }
}
