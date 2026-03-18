import { PrismaClient, Role, UserStatus, PaymentStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.payment.deleteMany()
  await prisma.mediaItem.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  const hash = (pw: string) => bcrypt.hashSync(pw, 12)

  // ─── Admin ───
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Eagles",
      email: "admin@eagles.com",
      passwordHash: hash("Admin123!"),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      city: "Sidi Bennour",
      phone: "0600000000",
      memberCode: "ADM-001",
      joinDate: new Date("2024-09-01"),
      membershipType: "Administrateur",
    },
  })

  // ─── Members ───
  const membersData = [
    { fullName: "Zakaria El Mansouri", email: "zak.mansouri@est.ma", city: "Sidi Bennour", phone: "0662450781", age: 22, joinDate: new Date("2025-01-05"), code: "MBR-001" },
    { fullName: "Imane Chami", email: "imane.chami@est.ma", city: "El Jadida", phone: "0678901334", age: 21, joinDate: new Date("2025-01-07"), code: "MBR-002" },
    { fullName: "Hamza Berrada", email: "hamza.berrada@est.ma", city: "Casablanca", phone: "0650889102", age: 23, joinDate: new Date("2024-12-20"), code: "MBR-003" },
    { fullName: "Sara Ouazzani", email: "sara.ouazzani@est.ma", city: "Sidi Bennour", phone: "0661234567", age: 20, joinDate: new Date("2025-02-01"), code: "MBR-004" },
    { fullName: "Youssef Bennani", email: "youssef.bennani@est.ma", city: "Marrakech", phone: "0699887766", age: 24, joinDate: new Date("2024-11-15"), code: "MBR-005" },
  ]

  const members = []
  for (const m of membersData) {
    const user = await prisma.user.create({
      data: {
        fullName: m.fullName,
        email: m.email,
        passwordHash: hash("Member123!"),
        role: Role.MEMBER,
        status: UserStatus.ACTIVE,
        city: m.city,
        phone: m.phone,
        age: m.age,
        memberCode: m.code,
        joinDate: m.joinDate,
        membershipType: "1 an",
      },
    })
    members.push(user)
  }

  // Mark one member as inactive/suspended
  await prisma.user.update({
    where: { id: members[2].id },
    data: { status: UserStatus.SUSPENDED },
  })

  // ─── Events ───
  await prisma.event.createMany({
    data: [
      {
        title: "Réunion Générale des Membres",
        description: "Réunion mensuelle pour discuter des activités du club et planifier les événements à venir.",
        location: "Campus EST - Amphi A",
        eventDate: new Date("2025-03-20"),
        eventTime: "14:00",
        capacity: 50,
        createdById: admin.id,
      },
      {
        title: "Tournoi Sportif Inter-Clubs",
        description: "Tournoi sportif annuel entre les clubs de l'EST.",
        location: "Stade Municipal Sidi Bennour",
        eventDate: new Date("2025-04-05"),
        eventTime: "09:00",
        capacity: 100,
        createdById: admin.id,
      },
      {
        title: "Workshop Leadership",
        description: "Atelier de développement personnel et leadership pour les membres.",
        location: "Salle de Conférence EST",
        eventDate: new Date("2025-04-15"),
        eventTime: "10:00",
        capacity: 30,
        createdById: admin.id,
      },
    ],
  })

  // ─── Payments ───
  await prisma.payment.createMany({
    data: [
      { userId: members[0].id, amount: 300, period: "2025", status: PaymentStatus.PAID, method: "Espèces", paymentDate: new Date("2025-01-05") },
      { userId: members[1].id, amount: 300, period: "2025", status: PaymentStatus.PAID, method: "Virement", paymentDate: new Date("2025-01-07") },
      { userId: members[2].id, amount: 300, period: "2025", status: PaymentStatus.UNPAID, method: null, paymentDate: null },
      { userId: members[3].id, amount: 300, period: "2025", status: PaymentStatus.PAID, method: "Carte", paymentDate: new Date("2025-02-01") },
      { userId: members[4].id, amount: 300, period: "2025", status: PaymentStatus.PENDING, method: null, paymentDate: null },
    ],
  })

  // ─── Announcements ───
  await prisma.announcement.createMany({
    data: [
      {
        title: "Inscription ouverte — Saison 2025",
        content: "Les inscriptions pour la nouvelle saison du Club Eagles sont maintenant ouvertes. Rejoignez-nous pour une année riche en activités, événements et découvertes. Tous les étudiants sont les bienvenus !",
        visibility: "public",
        pinned: true,
        createdById: admin.id,
      },
      {
        title: "Compte-rendu réunion de Mars",
        content: "Résumé de la réunion mensuelle : planification du tournoi sportif, budget approuvé pour les événements du semestre, nouveaux partenariats en discussion.",
        visibility: "membres",
        pinned: false,
        createdById: admin.id,
      },
      {
        title: "Rappel — Cotisations 2025",
        content: "Nous rappelons à tous les membres que les cotisations pour l'année 2025 doivent être réglées avant le 31 mars. Contactez le bureau pour toute question.",
        visibility: "membres",
        pinned: false,
        createdById: admin.id,
      },
    ],
  })

  // ─── Gallery Media Items ───
  await prisma.mediaItem.createMany({
    data: [
      { title: "Réunion d'ouverture 2025", imageUrl: "/placeholder.svg", category: "Réunions", uploadedById: admin.id },
      { title: "Tournoi sportif", imageUrl: "/placeholder.svg", category: "Sport", uploadedById: admin.id },
      { title: "Workshop Leadership", imageUrl: "/placeholder.svg", category: "Formation", uploadedById: admin.id },
      { title: "Sortie Club", imageUrl: "/placeholder.svg", category: "Sorties", uploadedById: admin.id },
      { title: "Cérémonie de remise", imageUrl: "/placeholder.svg", category: "Cérémonies", uploadedById: admin.id },
      { title: "Journée d'intégration", imageUrl: "/placeholder.svg", category: "Événements", uploadedById: admin.id },
    ],
  })

  console.log("✅ Database seeded successfully!")
  console.log(`   Admin: admin@eagles.com / Admin123!`)
  console.log(`   Members: [email]@est.ma / Member123!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
