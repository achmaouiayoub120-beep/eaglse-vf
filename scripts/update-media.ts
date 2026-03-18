import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.mediaItem.deleteMany()

  const admin = await prisma.user.findFirst({ where: { email: "admin@eagles.com" } })
  if (!admin) throw new Error("Admin not found")

  await prisma.mediaItem.createMany({
    data: [
      { title: "Tournoi sportif 2025", imageUrl: "/media/sports_tournament.png", category: "Sport", uploadedById: admin.id },
      { title: "Workshop Leadership", imageUrl: "/media/leadership_workshop.png", category: "Formation", uploadedById: admin.id },
      { title: "Sortie Club Hiking", imageUrl: "/media/club_outing.png", category: "Sorties", uploadedById: admin.id },
      { title: "Cérémonie de remise des prix", imageUrl: "/media/awards_ceremony.png", category: "Cérémonies", uploadedById: admin.id },
    ],
  })

  console.log("Media gallery updated successfully with real images!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
