import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, phone, city, age } = await req.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Nom complet, email et mot de passe requis" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const memberCount = await prisma.user.count({ where: { role: "MEMBER" } })

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "MEMBER",
        status: "ACTIVE",
        phone: phone || null,
        city: city || null,
        age: age ? parseInt(age) : null,
        memberCode: `MBR-${String(memberCount + 1).padStart(3, "0")}`,
        membershipType: "1 an",
      },
    })

    const token = await signToken({ userId: user.id, role: user.role, email: user.email })
    await setSessionCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
