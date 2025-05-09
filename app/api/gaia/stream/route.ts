import { NextRequest } from 'next/server';

// Get environment variables
const GAIA_MODEL_BASE_URL = process.env.GAIA_MODEL_BASE_URL || 'https://api.gaianet.ai/v1';
const GAIA_API_KEY = process.env.GAIA_API_KEY;

// Handle POST requests to /api/gaia/stream
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!GAIA_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Gaia API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Forward the request to Gaia API with streaming enabled
    const response = await fetch(`${GAIA_MODEL_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAIA_API_KEY}`
      },
      body: JSON.stringify({
        ...body,
        stream: true
      })
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: `Gaia API Error: ${response.status}`, details: errorData }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error: any) {
    console.error('Error in Gaia API streaming proxy:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
