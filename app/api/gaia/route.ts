import { NextRequest, NextResponse } from 'next/server';

// Get environment variables
const GAIA_MODEL_BASE_URL = process.env.GAIA_MODEL_BASE_URL || 'https://api.gaianet.ai/v1';
const GAIA_API_KEY = process.env.GAIA_API_KEY;

// Handle POST requests to /api/gaia
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!GAIA_API_KEY) {
      return NextResponse.json(
        { error: 'Gaia API key is not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Forward the request to Gaia API
    const response = await fetch(`${GAIA_MODEL_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAIA_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    // Check if the request was successful
    if (!response.ok) {
      let errorData;
      const responseText = await response.text();
      
      try {
        // Try to parse the error response as JSON
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails, use the response text instead
        errorData = { rawError: responseText || 'No error details available' };
      }
      
      return NextResponse.json(
        { error: `Gaia API Error: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    // Return the Gaia API response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in Gaia API proxy:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
