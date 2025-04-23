import { NextResponse } from 'next/server';
import { createBondRequest } from '@/app/models/BondRequest';
import { sendBondRequestEmail } from '@/app/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Creating bond request with data:", body);
    
    if (!body.userEmail) {
      console.log("No userEmail found in request"); // Debug log
      return NextResponse.json(
        { error: 'You must be logged in to make a bond request' },
        { status: 401 }
      );
    }

    // Generate a unique ID for the request
    const id = crypto.randomUUID();
    console.log("Generated request ID:", id);

    const bondRequest = {
      ...body,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending' as const
    };
    
    console.log("Saving bond request:", bondRequest);
    await createBondRequest(bondRequest);
    await sendBondRequestEmail(bondRequest);
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error processing bond request:', error);
    return NextResponse.json(
      { error: 'Failed to process bond request' },
      { status: 500 }
    );
  }
} 