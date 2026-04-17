import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submission';
import { sendContactNotification, sendAutoReply } from '@/lib/email';

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create new submission
    const submission = new Submission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    await submission.save();

    // Send email notification to admin
    try {
      await sendContactNotification(name, email, message);
    } catch (emailError) {
      console.error('Failed to send email notification to admin:', emailError);
      // Continue with the response even if email fails
    }
    
    // Send auto-reply email to the user
    try {
      await sendAutoReply(name, email);
    } catch (emailError) {
      console.error('Failed to send auto-reply email to user:', emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for your message! I\'ll get back to you soon.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Get all submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value;
    
    if (!authHeader?.startsWith('Bearer ') && !token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const submissions = await Submission.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// PUT - Reply to a submission (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id, reply } = await request.json();

    if (!id || !reply) {
      return NextResponse.json({ success: false, error: 'ID and reply are required' }, { status: 400 });
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { reply: reply.trim(), replied: true },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error replying to submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to reply' }, { status: 500 });
  }
}

// DELETE - Delete a submission (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await Submission.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
