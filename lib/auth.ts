import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "./prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
const COOKIE_NAME = "eagles-session"

// ─── Password helpers ───
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── JWT helpers ───
export async function signToken(payload: { userId: string; role: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; role: string; email: string }
  } catch {
    return null
  }
}

// ─── Session helpers ───
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      phone: true,
      city: true,
      age: true,
      status: true,
      memberCode: true,
      joinDate: true,
      membershipType: true,
      createdAt: true,
    },
  })
  return user
}

// ─── Role guard for API routes ───
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    return { error: "Non authentifié", status: 401, session: null }
  }
  return { error: null, status: 200, session }
}

export async function requireAdmin() {
  const result = await requireAuth()
  if (result.error) return result
  if (result.session!.role !== "ADMIN") {
    return { error: "Accès refusé", status: 403, session: null }
  }
  return result
}
