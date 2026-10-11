import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get a single template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Template fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// Update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, category, content, isHtml, previewImage } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Template content is required" },
        { status: 400 }
      );
    }

    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Update template
    const updatedTemplate = await prisma.template.update({
      where: { id: parseInt(params.id) },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        category: category?.trim() || "General",
        content: content.trim(),
        isHtml: Boolean(isHtml),
        previewImage: previewImage || null, // Add preview image field if provided
      },
    });

    return NextResponse.json({ template: updatedTemplate });
  } catch (error) {
    console.error("Template update error:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Delete template
    await prisma.template.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Template deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
} 