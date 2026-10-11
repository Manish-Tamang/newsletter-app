import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userData = requestCounts.get(ip)
  
  if (!userData || now > userData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return false
  }
  
  if (userData.count >= 100) { // Max 100 requests per minute
    return true
  }
  
  userData.count++
  return false
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // Rate limiting
  if (isRateLimited(ip)) {
    console.warn(`Rate limited IP: ${ip} - too many requests`)
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
  }
  
  // Validate URL to prevent abuse
  if (!imageUrl.startsWith('https://') || !imageUrl.includes('unlayer.com')) {
    console.warn(`Invalid image URL requested: ${imageUrl}`)
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
  }

  console.log(`Proxying image: ${imageUrl} for IP: ${ip}`)

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsletterApp/1.0)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error(`Error proxying image ${imageUrl}:`, error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
