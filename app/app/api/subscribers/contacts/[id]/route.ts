import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const result = await ResendService.deleteContact(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 