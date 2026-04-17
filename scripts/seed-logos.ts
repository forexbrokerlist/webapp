/**
 * Seed Broker Logos
 *
 * One-time (or re-runnable) script that fetches the logo for every broker
 * that is missing one, using Google's public favicon service, and stores the
 * result in Digital Ocean Spaces.
 *
 * Run with:
 *   bun run scripts/seed-logos.ts
 *   # or via the npm script:
 *   bun run seed:logos
 */

import { db } from "../services/db"
import { fetchAndUploadMedia } from "../lib/media"

const DELAY_MS = 500 // Google favicon service is generous — 500 ms is plenty

async function main() {
  console.log("🚀 Starting broker logo seeding...")

  // Fetch brokers that:
  //  • have no logo yet, OR
  //  • still point to an old non-S3 logo (e.g. a google favicon URL stored directly)
  const brokers = await db.brokers.findMany({
    where: {
      OR: [
        { logoUrl: null },
        { logoUrl: "" },
        { NOT: { logoUrl: { contains: "digitaloceanspaces.com" } } },
      ],
      // Must have a website so we can look up the domain
      broker_website: { not: null },
      NOT: { broker_website: "" },
    },
    select: {
      id: true,
      slug: true,
      broker_name: true,
      broker_website: true,
    },
  })

  console.log(`Found ${brokers.length} brokers that need a logo.`)

  let ok = 0
  let fail = 0

  for (const broker of brokers) {
    if (!broker.broker_website) continue

    const website = broker.broker_website.startsWith("http")
      ? broker.broker_website
      : `https://${broker.broker_website}`

    const path = `brokers/${broker.slug ?? `broker-${broker.id}`}/logo`

    console.log(
      `🖼  [${broker.broker_name ?? broker.slug}] Fetching logo from Google Favicons...`,
    )

    try {
      // "favicon" type → uses getFaviconFetchUrl → Google s2/favicons with sz=128
      const logoUrl = await fetchAndUploadMedia(website, path, "favicon")

      if (logoUrl) {
        await db.brokers.update({
          where: { id: broker.id },
          data: { logoUrl },
        })
        console.log(`  ✅ Saved: ${logoUrl}`)
        ok++
      } else {
        console.warn(`  ⚠️  Upload returned empty URL — skipping.`)
        fail++
      }
    } catch (err) {
      console.error(`  ❌ Failed for ${broker.broker_name ?? broker.slug}:`, err)
      fail++
    }

    // Small delay to be polite to Google's servers
    await new Promise(resolve => setTimeout(resolve, DELAY_MS))
  }

  console.log(`\n🏁 Done. ✅ ${ok} updated  ❌ ${fail} failed`)
}

main()
  .catch(err => {
    console.error("Fatal error:", err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    process.exit(0)
  })
