import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if username already exists
    const existingUsername = await db.collection('users').findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.collection('users').findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    await db.collection('otps').insertOne({
      email,
      otp,
      expiry: otpExpiry,
      createdAt: new Date(),
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    // Store user data temporarily
    await db.collection('pending_users').insertOne({
      username,
      email,
      password, // Note: In production, you should hash the password
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify OTP
export async function PUT(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find and verify OTP
    const otpRecord = await db.collection('otps').findOne({
      email,
      otp,
      expiry: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Get pending user data
    const pendingUser = await db.collection('pending_users').findOne({ email });
    if (!pendingUser) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 400 }
      );
    }

    // Create user
    const result = await db.collection('users').insertOne({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      createdAt: new Date(),
    });

    // Clean up
    await db.collection('otps').deleteOne({ _id: otpRecord._id });
    await db.collection('pending_users').deleteOne({ _id: pendingUser._id });

    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 