import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    const data = await req.json()

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location || null,
        eventDate: new Date(data.eventDate),
        eventTime: data.eventTime || null,
        capacity: data.capacity ? parseInt(data.capacity) : 50,
      },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Events PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    await prisma.event.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Events DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
