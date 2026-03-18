import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const announcements = await prisma.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      include: { createdBy: { select: { fullName: true } } },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error("Announcements GET error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const data = await req.json()

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility || "public",
        pinned: data.pinned || false,
        createdById: admin.session!.userId,
      },
      include: { createdBy: { select: { fullName: true } } },
    })

    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error) {
    console.error("Announcements POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
