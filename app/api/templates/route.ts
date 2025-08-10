import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ templates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, content, isHtml } = body;

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
