import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subject, content, fromEmail } = body

    if (!title || !subject || !content || !fromEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        subject,
        content,
        fromEmail,
        status: "draft",
      },
    })

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error("Failed to create campaign:", error)
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    )
  }
} 