import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { design, html, name, campaignId, templateId } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      )
    }

    // Save as a template if templateId is provided
    if (templateId) {
      const template = await prisma.template.update({
        where: { id: parseInt(templateId) },
        data: {
          content: html,
          isHtml: true,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        templateId: template.id,
        message: "Template design updated",
      })
    }

    // Save as a new template if no campaignId is provided
    if (!campaignId) {
      const template = await prisma.template.create({
        data: {
          name: name || "Draft Email",
          description: "Auto-saved email design",
          content: html,
          isHtml: true,
          category: "draft",
        },
      })

      return NextResponse.json({
        success: true,
        templateId: template.id,
        message: "Design saved as template",
      })
    }

    // Update existing campaign if campaignId is provided
    const campaign = await prisma.campaign.update({
      where: { id: parseInt(campaignId) },
      data: {
        content: html,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      message: "Campaign design updated",
    })
  } catch (error) {
    console.error("Error saving email design:", error)
    return NextResponse.json(
      { error: "Failed to save email design" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")
    const templateId = searchParams.get("templateId")

    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: parseInt(campaignId) },
      })

      if (!campaign) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        content: campaign.content,
        design: null, // We'll add design JSON support later
      })
    }

    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: parseInt(templateId) },
      })

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        content: template.content,
        design: null, // We'll add design JSON support later
      })
    }

    return NextResponse.json(
      { error: "Either campaignId or templateId is required" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error loading email design:", error)
    return NextResponse.json(
      { error: "Failed to load email design" },
      { status: 500 }
    )
  }
} 