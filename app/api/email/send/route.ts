import { NextRequest, NextResponse } from 'next/server';
import { ResendService, EmailData } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, from, replyTo } = body as EmailData;

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Validate email format
    if (Array.isArray(to)) {
      for (const email of to) {
        if (!ResendService.isValidEmail(email)) {
          return NextResponse.json(
            { error: `Invalid email format: ${email}` },
            { status: 400 }
          );
        }
      }
    } else {
      if (!ResendService.isValidEmail(to)) {
        return NextResponse.json(
          { error: `Invalid email format: ${to}` },
          { status: 400 }
        );
      }
    }

    // Send email
    const result = await ResendService.sendEmail({
      to,
      subject,
      html,
      text,
      from,
      replyTo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}