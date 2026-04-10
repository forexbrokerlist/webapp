import { PrismaClient } from './.generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "trusted-trading-platforms" },
    include: {
      brokers: {
        select: { id: true, broker_name: true, status: true }
      }
    }
  })

  if (!category) {
    console.log("CATEGORY_NOT_FOUND: 'trusted-trading-platforms'")
    const allCategories = await prisma.category.findMany({ select: { slug: true } })
    console.log("AVAILABLE_SLUGS:", allCategories.map(c => c.slug))
  } else {
    console.log("CATEGORY_FOUND:", category.name)
    console.log("BROKERS_COUNT:", category.brokers.length)
    console.log("BROKERS_LIST:", JSON.stringify(category.brokers, null, 2))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
