import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin, hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const session = auth.session!
    let users

    if (session.role === "ADMIN") {
      users = await prisma.user.findMany({
        where: { role: "MEMBER" },
        select: {
          id: true, fullName: true, email: true, role: true, phone: true,
          city: true, age: true, status: true, memberCode: true,
          joinDate: true, membershipType: true, createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      users = await prisma.user.findMany({
        where: { id: session.userId },
        select: {
          id: true, fullName: true, email: true, role: true, phone: true,
          city: true, age: true, status: true, memberCode: true,
          joinDate: true, membershipType: true, createdAt: true,
        },
      })
    }

    return NextResponse.json({ members: users })
  } catch (error) {
    console.error("Members GET error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status })

    const data = await req.json()
    const memberCount = await prisma.user.count({ where: { role: "MEMBER" } })

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: await hashPassword(data.password || "Member123!"),
        role: "MEMBER",
        status: data.status || "ACTIVE",
        phone: data.phone || null,
        city: data.city || null,
        age: data.age ? parseInt(data.age) : null,
        memberCode: `MBR-${String(memberCount + 1).padStart(3, "0")}`,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        membershipType: data.membershipType || "1 an",
      },
    })

    return NextResponse.json({ member: user }, { status: 201 })
  } catch (error) {
    console.error("Members POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
