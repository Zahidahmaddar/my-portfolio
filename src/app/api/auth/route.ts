import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/utils/auth';
import { clearLimit, clientIp, hit, isLimited } from '@/lib/rateLimit';

const MAX_FAILED_LOGINS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// POST - Admin login
export async function POST(request: NextRequest) {
  try {
    const limitKey = `login:${clientIp(request)}`;
    if (isLimited(limitKey, MAX_FAILED_LOGINS)) {
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields. Strings only, so a crafted object can't reach the query.
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Check password
    const isPasswordValid = user ? await user.comparePassword(password) : false;
    if (!user || !isPasswordValid) {
      hit(limitKey, MAX_FAILED_LOGINS, LOGIN_WINDOW_MS);
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    clearLimit(limitKey);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE - Admin logout
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
