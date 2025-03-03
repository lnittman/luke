import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { Readable } from 'stream';

/**
 * API route to upload files to Vercel Blob
 * Accepts multipart/form-data with a file and filename
 */
export async function POST(request: NextRequest) {
  try {
    // Check if content type is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    
    // Get the file and filename
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Vercel Blob
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public', // Make files publicly accessible
    });

    // Return the URL of the uploaded blob
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to Vercel Blob' },
      { status: 500 }
    );
  }
}

// Set larger limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}; 