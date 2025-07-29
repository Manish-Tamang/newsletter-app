import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    const result = await ResendService.getContacts();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Contacts fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!ResendService.isValidEmail(email)) {
      return NextResponse.json(
        { error: `Invalid email format: ${email}` },
        { status: 400 }
      );
    }

    // Add contact
    const result = await ResendService.addContact(email, firstName, lastName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact added successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Add contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 