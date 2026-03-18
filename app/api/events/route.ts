import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const events = await prisma.event.findMany({
      orderBy: { eventDate: "desc" },
      include: { createdBy: { select: { fullName: true } } },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Events GET error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const data = await req.json()

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location || null,
        eventDate: new Date(data.eventDate),
        eventTime: data.eventTime || null,
        capacity: data.capacity ? parseInt(data.capacity) : 50,
        imageUrl: data.imageUrl || null,
        createdById: admin.session!.userId,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("Events POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
