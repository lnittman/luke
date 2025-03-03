import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

/**
 * API route to list all files stored in Vercel Blob
 */
export async function GET(request: NextRequest) {
  try {
    // Get list of all blobs
    const { blobs } = await list();
    
    // Transform the data to include only what's needed
    const blobList = blobs.map(blob => ({
      pathname: blob.pathname,
      url: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }));
    
    // Return the list of blobs
    return NextResponse.json({ blobs: blobList });
  } catch (error) {
    console.error('Error listing blobs:', error);
    return NextResponse.json(
      { error: 'Failed to list files from Vercel Blob' },
      { status: 500 }
    );
  }
} 