import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Vérifier la configuration
  const config = {
    environment: process.env.NODE_ENV,
    uploadProvider: process.env.UPLOAD_PROVIDER,
    github: {
      tokenExists: !!process.env.GITHUB_TOKEN,
      tokenLength: process.env.GITHUB_TOKEN?.length,
      tokenStart: process.env.GITHUB_TOKEN?.substring(0, 10),
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      branch: process.env.GITHUB_BRANCH
    },
    openai: {
      keyExists: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length,
      keyStart: process.env.OPENAI_API_KEY?.substring(0, 10)
    },
    airtable: {
      keyExists: !!process.env.AIRTABLE_API_KEY,
      baseId: process.env.AIRTABLE_BASE_ID,
      tableName: process.env.AIRTABLE_TABLE_NAME
    }
  };

  return NextResponse.json(config);
}