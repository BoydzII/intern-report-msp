import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Google Drive URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    const headers = new Headers();
    // Default to jpeg if content-type is missing or generic
    const contentType = response.headers.get('Content-Type');
    headers.set('Content-Type', contentType && contentType.includes('image') ? contentType : 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    
    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Proxy image error:", error);
    return new NextResponse("Error fetching image: " + error.message, { status: 500 });
  }
}
