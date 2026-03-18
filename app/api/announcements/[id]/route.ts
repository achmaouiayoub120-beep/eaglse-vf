import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    const data = await req.json()

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility,
        pinned: data.pinned,
      },
    })

    return NextResponse.json({ announcement })
  } catch (error) {
    console.error("Announcements PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    await prisma.announcement.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Announcements DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
