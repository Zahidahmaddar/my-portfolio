import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/lib/models/siteSettings';
import { isAuthenticated } from '@/utils/auth';

// GET - Fetch site settings (public)
export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        heroSubtitle: 'Full Stack Developer',
        titleLine1: 'Zahid',
        titleLine2: 'Farooq',
        heroDescription: '',
        heroImage: '',
        aboutImage: '',
        aboutParagraphs: [],
        resumeUrl: '',
        stats: [],
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(body);
    } else {
      Object.assign(settings, body, { updatedAt: new Date() });
    }

    await settings.save();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update site settings' }, { status: 500 });
  }
}
