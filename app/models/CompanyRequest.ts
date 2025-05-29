import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);

export interface CompanyRequest {
  _id: string;
  email: string;
  dugaar: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export async function getCompanyRequests() {
  try {
    await client.connect();
    const db = client.db();
    const requests = await db.collection("companyRequests").find({}).toArray();
    return requests;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}

export async function updateCompanyRequestStatus(
  id: string,
  status: string,
  declineReason?: string
) {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("companyRequests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          ...(declineReason && { declineReason }),
          updatedAt: new Date(),
        },
      }
    );
    return result;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}
