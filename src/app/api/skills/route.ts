import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/db';
import Skill from '@/lib/models/skill';
import { isAuthenticated } from '@/utils/auth';

function parseLevel(level: unknown): number | null {
  const value = Number(level);
  if (level === undefined || level === null || level === '' || Number.isNaN(value)) return null;
  return Math.min(100, Math.max(0, value));
}

// GET - Fetch all skills (public)
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST - Create new skill (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name } = body;
    const level = parseLevel(body.level);

    if (!name || level === null) {
      return NextResponse.json({ success: false, error: 'Name and level are required' }, { status: 400 });
    }

    const skill = new Skill({ name, level });
    await skill.save();
    revalidatePath('/');
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ success: false, error: 'Failed to create skill' }, { status: 500 });
  }
}

// PUT - Update skill (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { id, name } = body;
    const level = parseLevel(body.level);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }

    if (!name || level === null) {
      return NextResponse.json({ success: false, error: 'Name and level are required' }, { status: 400 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, level },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ success: false, error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE - Delete skill (admin only)
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
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete skill' }, { status: 500 });
  }
}
