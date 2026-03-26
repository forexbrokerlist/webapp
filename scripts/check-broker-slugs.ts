import { db } from "../services/db"

async function main() {
  const sponsors = await db.brokers.findMany({
    where: { isSponsor: true },
    select: { id: true, broker_name: true, slug: true }
  })

  console.log(`Found ${sponsors.length} sponsors.`)
  sponsors.forEach(s => {
    if (!s.slug) {
      console.log(`Sponsor ${s.broker_name} (ID: ${s.id}) is missing a slug.`)
    } else {
      console.log(`Sponsor ${s.broker_name} has slug: ${s.slug}`)
    }
  })
}

main()
