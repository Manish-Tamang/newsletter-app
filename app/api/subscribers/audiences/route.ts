import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    const result = await ResendService.getAudiences();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch audiences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Audiences fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 