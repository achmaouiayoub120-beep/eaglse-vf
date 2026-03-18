import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const session = auth.session!
    let payments

    if (session.role === "ADMIN") {
      payments = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, email: true } } },
      })
    } else {
      payments = await prisma.payment.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, email: true } } },
      })
    }

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Payments GET error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const data = await req.json()

    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        amount: parseFloat(data.amount),
        period: data.period,
        status: data.status || "UNPAID",
        method: data.method || null,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        note: data.note || null,
      },
      include: { user: { select: { fullName: true, email: true } } },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error("Payments POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
