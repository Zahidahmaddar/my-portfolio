import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import SiteSettings from '@/lib/models/siteSettings';
import { isAuthenticated } from '@/utils/auth';

const TEXT_FIELDS = [
  'heroSubtitle',
  'heroImage',
  'titleLine1',
  'titleLine2',
  'heroDescription',
  'aboutImage',
  'resumeUrl',
  'aiModel',
] as const;

// GET - Fetch site settings (the chatbot model is only shown to the admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const settings = (await SiteSettings.findOne()) ?? new SiteSettings();
    const data = settings.toObject();
    if (!isAuthenticated(request)) delete data.aiModel;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings (admin only). Fields left out of the body are kept.
export async function PUT(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of TEXT_FIELDS) {
      if (typeof body[field] === 'string') updates[field] = body[field].trim();
    }
    if (Array.isArray(body.aboutParagraphs)) {
      updates.aboutParagraphs = body.aboutParagraphs
        .filter((p: unknown): p is string => typeof p === 'string')
        .map((p: string) => p.trim())
        .filter(Boolean);
    }
    if (Array.isArray(body.stats)) {
      updates.stats = body.stats
        .map((s: { value?: unknown; label?: unknown }) => ({
          value: String(s?.value ?? '').trim(),
          label: String(s?.label ?? '').trim(),
        }))
        .filter((s: { value: string; label: string }) => s.value && s.label);
    }

    const settings = (await SiteSettings.findOne()) ?? new SiteSettings();
    settings.set(updates);
    await settings.save();

    revalidatePath('/');
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update site settings' }, { status: 500 });
  }
}
