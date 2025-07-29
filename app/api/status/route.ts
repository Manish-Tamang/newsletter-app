import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    const apiStatus = await ResendService.checkApiStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        apiConnected: apiStatus,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check API status',
        data: {
          apiConnected: false,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        }
      },
      { status: 500 }
    );
  }
}