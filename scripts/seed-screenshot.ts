import { db } from "../services/db"
import { fetchAndUploadMedia } from "../lib/media"
import { getDomain } from "@primoui/utils"

async function main() {
  console.log("🚀 Starting screenshot seeding...")

  const brokers = await db.brokers.findMany({
    where: {
      OR: [
        { screenshotUrl: null },
        { screenshotUrl: "" },
        // Also captures brokers whose screenshotUrl is not an S3 URL (e.g. from the initial seed)
        { NOT: { screenshotUrl: { contains: "digitaloceanspaces.com" } } }
      ],
      broker_website: { not: "" }
    }
  })

  console.log(`Found ${brokers.length} brokers needing screenshots.`)

  let keyIndex = 0
  for (const broker of brokers) {
    if (!broker.broker_website) continue

    const domain = getDomain(broker.broker_website)
    const path = `brokers/${broker.slug || domain}/screenshot`

    console.log(`📸 Fetching screenshot for ${broker.broker_name} (${broker.broker_website})...`)

    try {
      const s3Url = await fetchAndUploadMedia(
        broker.broker_website,
        path,
        "screenshot",
        keyIndex
      )

      if (s3Url) {
        await db.brokers.update({
          where: { id: broker.id },
          data: { screenshotUrl: s3Url }
        })
        console.log(`✅ Updated ${broker.broker_name}: ${s3Url}`)
      }
    } catch (error) {
      console.error(`❌ Failed for ${broker.broker_name}:`, error)
    }

    keyIndex++ // Force rotation for the next attempt

    // Longer delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  console.log("🏁 Screenshot seeding completed.")
}

main()
  .catch((err) => {
    console.error("Fatal error in screenshot seeding script:", err)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
