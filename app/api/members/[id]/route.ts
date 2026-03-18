import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    const data = await req.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        age: data.age ? parseInt(data.age) : null,
        status: data.status,
        membershipType: data.membershipType,
      },
    })

    return NextResponse.json({ member: user })
  } catch (error) {
    console.error("Members PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Members DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
