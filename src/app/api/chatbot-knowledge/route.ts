import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChatbotKnowledge from '@/lib/models/chatbotKnowledge';
import { isAuthenticated } from '@/utils/auth';

// GET - Fetch all knowledge entries (public for chatbot use)
export async function GET() {
  try {
    await connectDB();
    const entries = await ChatbotKnowledge.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching chatbot knowledge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chatbot knowledge' },
      { status: 500 }
    );
  }
}

// POST - Create new knowledge entry (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const entry = new ChatbotKnowledge({ title, content });
    await entry.save();
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating chatbot knowledge:', error);
    return NextResponse.json({ success: false, error: 'Failed to create entry' }, { status: 500 });
  }
}

// PUT - Update knowledge entry (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { id, title, content } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Entry ID is required' }, { status: 400 });
    }

    const entry = await ChatbotKnowledge.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error updating chatbot knowledge:', error);
    return NextResponse.json({ success: false, error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE - Delete knowledge entry (admin only)
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
      return NextResponse.json({ success: false, error: 'Entry ID is required' }, { status: 400 });
    }

    const entry = await ChatbotKnowledge.findByIdAndDelete(id);
    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting chatbot knowledge:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete entry' }, { status: 500 });
  }
}
