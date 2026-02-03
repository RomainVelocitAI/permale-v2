import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'Set' : 'Not set',
      GITHUB_OWNER: process.env.GITHUB_OWNER || 'Not set',
      GITHUB_REPO: process.env.GITHUB_REPO || 'Not set',
      UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER || 'Not set',
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}