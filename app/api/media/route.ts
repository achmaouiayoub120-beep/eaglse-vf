import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const media = await prisma.mediaItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { fullName: true } } },
    })

    return NextResponse.json({ media })
  } catch (error) {
    console.error("Media GET error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const data = await req.json()

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        category: data.category || null,
        description: data.description || null,
        uploadedById: admin.session!.userId,
      },
      include: { uploadedBy: { select: { fullName: true } } },
    })

    return NextResponse.json({ mediaItem }, { status: 201 })
  } catch (error) {
    console.error("Media POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 })

    await prisma.mediaItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Media DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
