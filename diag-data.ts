import { PrismaClient } from './.generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = ["trusted-trading-platforms", "crm-and-back-office-software"]
  
  for (const slug of categories) {
    console.log(`\n--- Checking Category: ${slug} ---`)
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        brokers: {
          select: {
            id: true,
            broker_name: true,
            broker_website: true,
            screenshotUrl: true,
            status: true
          }
        }
      }
    })

    if (!category) {
      console.log("RESULT: Category not found!")
      continue
    }

    console.log(`RESULT: Found category "${category.name}" with ${category.brokers.length} brokers.`)
    category.brokers.forEach(b => {
      console.log(` - ID: ${b.id} | Name: ${b.broker_name} | Status: ${b.status}`)
      console.log(`   Website: ${b.broker_website || 'MISSING'}`)
      console.log(`   Screenshot: ${b.screenshotUrl || 'MISSING'}`)
    })
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
