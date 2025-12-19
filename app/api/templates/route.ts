import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        content: true,
        isHtml: true,
        createdAt: true,
        updatedAt: true,
        usage: true,
      },
    });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Templates fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Create template with validated data
    const template = await prisma.template.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        category: category?.trim() || "General",
        content: content.trim(),
        isHtml: Boolean(isHtml),
        previewImage: previewImage || null,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Template creation error:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
