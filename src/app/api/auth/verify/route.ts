import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/utils/auth';

// GET - Verify authentication status
export async function GET(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication verification failed' },
      { status: 500 }
    );
  }
}
