import { db } from "../services/db"

async function checkSponsors() {
  const sponsors = await db.sponsor.findMany({
    take: 5,
    select: {
      name: true,
      socialProof: true,
      highlightedPoint: true
    }
  })
  console.log(JSON.stringify(sponsors, null, 2))
}

checkSponsors()
  .catch(console.error)
  .finally(() => process.exit())
