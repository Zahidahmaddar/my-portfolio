import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submission';
import { sendContactNotification, sendAutoReply, sendReply } from '@/lib/email';
import { isAuthenticated } from '@/utils/auth';
import { clientIp, hit } from '@/lib/rateLimit';

const MAX_NAME = 120;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = asText(body.name);
    const email = asText(body.email).toLowerCase();
    const subject = asText(body.subject);
    const message = asText(body.message);

    // Honeypot: people never see this field, so a filled one means a bot.
    // Answer as usual so it doesn't learn to avoid the field.
    if (asText(body.company)) {
      return NextResponse.json(
        { success: true, message: 'Thank you for your message! I\'ll get back to you soon.' },
        { status: 201 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid email address' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME || subject.length > MAX_SUBJECT || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { success: false, error: `Keep your message under ${MAX_MESSAGE} characters` },
        { status: 400 }
      );
    }

    if (!hit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many messages. Try again in a few minutes.' },
        { status: 429 }
      );
    }

    await connectDB();

    // Create new submission
    const submission = new Submission({ name, email, subject, message });
    await submission.save();

    // The message is saved, so a mail failure shouldn't fail the request
    await Promise.allSettled([
      sendContactNotification(name, email, message, subject),
      sendAutoReply(name, email),
    ]);

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
    const user = isAuthenticated(request);
    if (!user) {
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
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id, reply: rawReply } = await request.json();
    const reply = asText(rawReply);

    if (!id || !reply) {
      return NextResponse.json({ success: false, error: 'ID and reply are required' }, { status: 400 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    // Only mark as replied once the visitor has actually been emailed
    const sent = await sendReply(
      submission.name,
      submission.email,
      reply,
      submission.message,
      submission.subject
    );

    if (!sent) {
      return NextResponse.json(
        { success: false, error: `The email to ${submission.email} could not be sent. Your reply was not delivered.` },
        { status: 502 }
      );
    }

    submission.reply = reply;
    submission.replied = true;
    await submission.save();

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error replying to submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to reply' }, { status: 500 });
  }
}

// DELETE - Delete a submission (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
