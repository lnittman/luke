import { NextRequest, NextResponse } from 'next/server';
import { put, list, del, head, getDownloadUrl } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { getOpenRouterKey, getOpenRouterHeaders } from '@/lib/api-keys';
import axios from 'axios';

// Define interfaces for our diagnostic data
interface FileInfo {
  filename: string;
  size: number;
  lastModified: string;
}

interface ErrorInfo {
  message: string;
  name: string;
}

interface DiagnosticInfo {
  timestamp: string;
  environment: string;
  services: {
    vercelBlob: {
      status: string;
      details: Record<string, any>;
      error: ErrorInfo | string | null;
    };
    techFiles: {
      status: string;
      localFiles: FileInfo[];
      error: string | ErrorInfo | null;
    };
    env: {
      BLOB_READ_WRITE_TOKEN: string;
      VERCEL_BLOB_TOKEN: string;
      BLOB_STORE_ID: string | undefined;
    };
  };
}

// Directory structure constants
const DOCS_DIR = path.join(process.cwd(), 'docs');
const TEMPLATE_DIR = path.join(DOCS_DIR, 'template');
const TOOLS_DIR = path.join(DOCS_DIR, 'tools');

// Check for token in request headers or environment
function getBlobToken(request: NextRequest): string | undefined {
  // Check for token in custom header
  const headerToken = request.headers.get('x-vercel-blob-token');
  if (headerToken) {
    return headerToken;
  }
  
  // Fall back to environment variables
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN;
}

export async function GET(request: NextRequest) {
  // Check environment variables, but mask sensitive parts
  const envVars = {
    openRouterKeyExists: !!process.env.OPENROUTER_API_KEY,
    openRouterKeyFirstChars: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
    hardcodedKeyFirstChars: getOpenRouterKey()?.substring(0, 10) + '...',
    perplexityKeyExists: !!process.env.PERPLEXITY_API_KEY,
    blobTokenExists: !!process.env.BLOB_READ_WRITE_TOKEN,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  // Test APIs
  const apiTests = {
    openRouter: { status: 'untested', message: '', data: null as any },
    blob: { status: 'untested', message: '', data: null as any }
  };
  
  // Test OpenRouter API
  try {
    const headers = getOpenRouterHeaders();
    const response = await axios.post(
      'https://openrouter.ai/api/v1/auth/key',
      {},
      { headers }
    );
    
    if (response.status === 200) {
      apiTests.openRouter = { 
        status: 'ok', 
        message: 'API key is valid',
        data: response.data
      };
    } else {
      apiTests.openRouter = { 
        status: 'error', 
        message: `Status: ${response.status}`,
        data: null
      };
    }
  } catch (error) {
    apiTests.openRouter = { 
      status: 'error', 
      message: error instanceof Error ? error.message : String(error),
      data: null
    };
  }
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envVars,
    apiTests
  });
}

// Helper function to check if a path exists
async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
} 