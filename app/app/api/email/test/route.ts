import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, content } = body;

    // Validate required fields
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!ResendService.isValidEmail(to)) {
      return NextResponse.json(
        { error: `Invalid email format: ${to}` },
        { status: 400 }
      );
    }

    // Check API status
    const apiStatus = await ResendService.checkApiStatus();
    if (!apiStatus) {
      return NextResponse.json(
        { error: 'Resend API is not properly configured. Please check your API key.' },
        { status: 500 }
      );
    }

    // Send test email
    const result = await ResendService.sendTestEmail(to, subject, content);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send test email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Test email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}