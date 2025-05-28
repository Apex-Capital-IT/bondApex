import { NextResponse } from "next/server";
import axios from "axios";
import qs from "querystring";
import clientPromise from "@/lib/mongodb";

const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const TENANT_ID = process.env.MICROSOFT_TENANT_ID;
const EXCEL_FILE_PATH = process.env.EXCEL_FILE_PATH;
const SHEET_NAME = process.env.EXCEL_SHEET_NAME || "Sheet1";

async function getAccessToken() {
  try {
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
      throw new Error("Missing required environment variables");
    }

    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

    const response = await axios.post(
      tokenEndpoint,
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (!response.data.access_token) {
      throw new Error("No access token in response");
    }

    return response.data.access_token;
  } catch (error: any) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг оруулна уу" },
        { status: 400 }
      );
    }

    // First check if user already exists in database
    const client = await clientPromise;
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Энэ и-мэйл хаяг аль хэдийн manai systemd бүртгэгдсэн байна ta nevtreh heseg ruu orj nevterne uu",
        },
        { status: 400 }
      );
    }

    // 1. Get access token
    const token = await getAccessToken();

    // 2. Get OneDrive file list
    const fileEndpoint = `https://graph.microsoft.com/v1.0/users/it@apex.mn/drive/root/children`;

    const fileResponse = await axios.get(fileEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const excelFile = fileResponse.data.value.find(
      (file: any) => file.name === "bond.apex.mn.xlsx"
    );

    if (!excelFile) {
      return NextResponse.json(
        { error: "Excel файл олдсонгүй" },
        { status: 404 }
      );
    }

    // 3. Get worksheet data
    const worksheetEndpoint = `https://graph.microsoft.com/v1.0/users/it@apex.mn/drive/items/${excelFile.id}/workbook/worksheets('${SHEET_NAME}')/usedRange`;
    const worksheetResponse = await axios.get(worksheetEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (
      !worksheetResponse.data ||
      !worksheetResponse.data.values ||
      !Array.isArray(worksheetResponse.data.values)
    ) {
      return NextResponse.json(
        { error: "Excel файлд хандах боломжгүй байна" },
        { status: 500 }
      );
    }

    // 4. Search by row: [lastName, firstName, email]
    const values = worksheetResponse.data.values; // 2D array
    let foundRow = null;

    for (const row of values) {
      if (
        Array.isArray(row) &&
        row.length >= 3 &&
        typeof row[2] === "string" &&
        row[2].toLowerCase().trim() === email.toLowerCase().trim()
      ) {
        foundRow = row;
        break;
      }
    }

    if (!foundRow) {
      return NextResponse.json(
        {
          error: "Dbx Бүртгэлгүй и-мэйл хаяг байна",
          isAllowed: false,
        },
        { status: 403 }
      );
    }

    const lastName = foundRow[0] || "";
    const firstName = foundRow[1] || "";
    const foundEmail = foundRow[2] || "";

    return NextResponse.json({
      isAllowed: true,
      lastName,
      firstName,
      email: foundEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Системийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}
