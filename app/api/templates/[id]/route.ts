import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const template = await prisma.template.findUnique({ where: { id: Number(params.id) } });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
    return NextResponse.json({ template });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { name, description, category, content, htmlContent, isHtml } = body;
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }
    const template = await prisma.template.update({
      where: { id: Number(params.id) },
      data: {
        name,
        description,
        category,
        content,
        htmlContent,
        isHtml,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ template });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.template.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
} 