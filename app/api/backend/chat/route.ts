import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, session_id } = body;

    // Get backend URL from environment or headers
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Forward request to FastAPI backend
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend chat API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to process chat request: ${errorMessage}` },
      { status: 500 },
    );
  }
}
