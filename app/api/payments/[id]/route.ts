import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    const data = await req.json()

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount ? parseFloat(data.amount) : undefined,
        period: data.period,
        status: data.status,
        method: data.method || null,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        note: data.note || null,
      },
      include: { user: { select: { fullName: true, email: true } } },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error("Payments PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const { id } = await params
    await prisma.payment.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payments DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
