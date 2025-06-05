import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const backendUrl =
      req.headers.get('X-Backend-URL') ||
      process.env.BACKEND_URL ||
      'http://localhost:8000';

    const response = await fetch(`${backendUrl}/generate-executable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Backend responded with status: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling backend executable API:', error);
    return new Response(
      JSON.stringify({
        error: `Failed to generate executable: ${error.message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
