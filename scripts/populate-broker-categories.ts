import { db as prisma } from "../services/db"

async function main() {
  console.log("Starting forex brokers category population script...")

  // Find or create the target category "Forex Brokers"
  let category = await prisma.category.findFirst({
    where: {
      slug: "forex-brokers",
    },
  })

  if (!category) {
      console.log("Category 'forex-brokers' not found, creating it...")
      category = await prisma.category.create({
          data: {
              name: "Forex Brokers",
              slug: "forex-brokers",
              description: "A directory of the top Forex Brokers",
              label: "Brokers"
          }
      })
      console.log(`Created category: ${category.name} (${category.id})`)
  } else {
      console.log(`Found category: ${category.name} (${category.id})`)
  }

  // Find all brokers that don't have this category yet (optimization)
  const brokersWithoutCategory = await prisma.brokers.findMany({
    where: {
      NOT: {
        categories: {
          some: {
            id: category.id,
          },
        },
      },
    },
    select: {
      id: true,
      broker_name: true,
    },
  })

  console.log(`Found ${brokersWithoutCategory.length} brokers that need the category.`)

  if (brokersWithoutCategory.length === 0) {
    console.log("All brokers already have the category. Exiting.")
    return
  }

  // Update them
  let updatedCount = 0
  for (const broker of brokersWithoutCategory) {
    try {
      await prisma.brokers.update({
        where: { id: broker.id },
        data: {
          categories: {
            connect: { id: category.id },
          },
        },
      })
      updatedCount++
      if (updatedCount % 50 === 0) {
        console.log(`Updated ${updatedCount}/${brokersWithoutCategory.length} brokers...`)
      }
    } catch (error) {
      console.error(`Error updating broker ${broker.id} (${broker.broker_name}):`, error)
    }
  }

  console.log(`Successfully connected ${updatedCount} brokers to the category ${category.name}.`)
}

main()
  .catch(e => {
    console.error("Script failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
