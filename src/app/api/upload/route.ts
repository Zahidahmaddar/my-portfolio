import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/utils/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
];

// POST - Upload a file (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Upload an image or a PDF' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'Files must be 10 MB or smaller' }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ success: false, error: 'Cloudinary not configured' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary blocks PDF delivery from the image pipeline on many accounts,
    // so PDFs go up as raw files, which are always served as-is
    const isPdf = file.type === 'application/pdf';

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: isPdf ? 'raw' : 'image',
          ...(isPdf ? { use_filename: true, unique_filename: true, filename_override: file.name } : {}),
        },
        (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'));
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: { url: result.secure_url, filename: result.public_id },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}
