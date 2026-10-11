import { NextRequest, NextResponse } from 'next/server';
import { ResendService, CampaignData } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, content, subscribers, fromEmail, replyTo } = body as CampaignData;

    console.log("========================================");
    console.log("CAMPAIGN SEND API REQUEST RECEIVED:");
    console.log("Title:", title);
    console.log("Subject:", subject);
    console.log("Subscribers Count:", subscribers ? subscribers.length : 0);
    console.log("Content Length:", content ? content.length : 0);
    console.log("Content Preview (first 250 chars):", content ? content.substring(0, 250) : "EMPTY");
    console.log("========================================");

    // Validate required fields
    if (!title || !subject || !content || !subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subject, content, subscribers' },
        { status: 400 }
      );
    }

    // Validate subscriber emails
    for (const email of subscribers) {
      if (!ResendService.isValidEmail(email)) {
        return NextResponse.json(
          { error: `Invalid email format: ${email}` },
          { status: 400 }
        );
      }
    }

    // Check API status
    const apiStatus = await ResendService.checkApiStatus();
    if (!apiStatus) {
      return NextResponse.json(
        { error: 'Resend API is not properly configured. Please check your API key.' },
        { status: 500 }
      );
    }

    // Send campaign
    const result = await ResendService.sendCampaign({
      title,
      subject,
      content,
      subscribers,
      fromEmail,
      replyTo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign sent successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Campaign send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}