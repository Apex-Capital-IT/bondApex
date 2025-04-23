import { NextResponse } from 'next/server';

// This should be stored in a secure environment variable in production
const ADMIN_CODE = process.env.ADMIN_CODE || '';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    console.log('Received code:', code);
    console.log('Expected code:', ADMIN_CODE);

    if (!ADMIN_CODE) {
      console.log('Admin code not configured');
      return NextResponse.json(
        { error: 'Admin code not configured' },
        { status: 500 }
      );
    }

    if (code === ADMIN_CODE) {
      console.log('Code matched successfully');
      return NextResponse.json({ success: true });
    }

    console.log('Code did not match');
    return NextResponse.json(
      { error: 'Invalid security code' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!ADMIN_CODE) {
      return NextResponse.json(
        { error: 'Admin code not configured' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 