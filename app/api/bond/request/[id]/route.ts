import { NextResponse } from 'next/server';
import { updateBondRequest, getBondRequest } from '@/app/models/BondRequest';
import { sendBondRequestStatusEmail } from '@/app/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, declineReason } = await request.json();
    const requestId = params.id;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get the existing bond request to ensure we have all the data
    const existingRequest = await getBondRequest(requestId);
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Bond request not found' },
        { status: 404 }
      );
    }

    const updatedRequest = await updateBondRequest(requestId, {
      status,
      declineReason,
    });

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Failed to update bond request' },
        { status: 500 }
      );
    }

    // Send status update email
    try {
      await sendBondRequestStatusEmail(
        updatedRequest,
        status as 'accepted' | 'declined',
        declineReason
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating bond request:', error);
    return NextResponse.json(
      { error: 'Failed to update bond request' },
      { status: 500 }
    );
  }
} 