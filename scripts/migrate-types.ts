import { db } from "../services/db"

async function main() {
  console.log("🚀 Starting Broker Type migration...")

  const brokers = await db.brokers.findMany({
    select: {
      id: true,
      broker_name: true,
      type: true,
    },
  })

  console.log(`Found ${brokers.length} brokers to check.`)

  const uniqueTypes = [...new Set(brokers.map(b => b.type).filter(Boolean))] as string[]
  console.log(`Unique types found in data: ${uniqueTypes.join(", ")}`)

  // 1. Create Type records for each unique enum value
  const typeMap: Record<string, string> = {}
  for (const typeName of uniqueTypes) {
    const typeRecord = await db.type.upsert({
      where: { slug: typeName.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name: typeName,
        slug: typeName.toLowerCase().replace(/\s+/g, "-"),
      },
    })
    typeMap[typeName] = typeRecord.id
    console.log(`✅ Ensured Type record exists for: ${typeName} (ID: ${typeRecord.id})`)
  }

  // 2. Link Brokers to their new Type model
  let updatedCount = 0
  for (const broker of brokers) {
    if (broker.type && typeMap[broker.type]) {
      await db.brokers.update({
        where: { id: broker.id },
        data: {
          typeId: typeMap[broker.type],
        },
      })
      updatedCount++
    }
  }

  console.log(`🎉 Success! Updated ${updatedCount} brokers with the new Type relation.`)
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    // No need to close if using singleton from service, but good practice
  })
