/**
 * Cron route: Update Broker Logos
 *
 * Triggered by Vercel Cron on the 1st of every month at 02:00 UTC.
 * Schedule is defined in vercel.json:
 *   { "path": "/api/cron/update-broker-logos", "schedule": "0 2 1 * *" }
 *
 * Fetches the broker logo from Google's favicon service
 * (https://www.google.com/s2/favicons?domain=<domain>&sz=128)
 * and stores the result in the protected Digital Ocean Spaces bucket.
 * The logoUrl field is updated in the database after each successful upload.
 */

import { revalidateTag } from "next/cache"
import { env } from "~/env"
import { fetchAndUploadMedia } from "~/lib/media"
import { db } from "~/services/db"

// Vercel Serverless Function max duration (seconds)
// Logo fetches are fast — 60 s is more than enough for a full batch.
export const maxDuration = 300

export async function GET(req: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  // ── Query brokers that need logo refresh ──────────────────────────────────
  // We re-fetch every broker on each monthly run so logos stay up to date.
  // If you only want to fill missing logos, swap `OR` for a `logoUrl: null` filter.
  // Refresh logos for ALL brokers every month — no conditions on logoUrl.
  // This ensures logos stay current if a broker rebrands.
  const brokers = await db.brokers.findMany({
    where: {
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

  console.info(`[update-broker-logos] Processing ${brokers.length} brokers`)

  const results: Array<{ id: number; slug: string | null; success: boolean; error?: string }> = []

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  for (const broker of brokers) {
    if (!broker.broker_website) continue

    const website = broker.broker_website.startsWith("http")
      ? broker.broker_website
      : `https://${broker.broker_website}`

    const path = `brokers/${broker.slug ?? `broker-${broker.id}`}/logo`

    try {
      console.info(`[${broker.slug}] Fetching logo via Google Favicons...`)

      // "favicon" type uses getFaviconFetchUrl → Google s2/favicons?domain=…&sz=128
      const logoUrl = await fetchAndUploadMedia(website, path, "favicon")

      if (logoUrl) {
        await db.brokers.update({
          where: { id: broker.id },
          data: { logoUrl },
        })

        // Invalidate the individual broker page cache
        revalidateTag(`broker-${broker.slug}`, "infinite")
        results.push({ id: broker.id, slug: broker.slug, success: true })
        console.info(`[${broker.slug}] ✅ Logo updated: ${logoUrl}`)
      } else {
        results.push({ id: broker.id, slug: broker.slug, success: false, error: "Upload returned empty URL" })
        console.warn(`[${broker.slug}] ⚠️ Upload returned empty URL`)
      }

      // Small courtesy delay between requests (Google is lenient but let's be polite)
      await wait(500)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[${broker.slug}] ❌ Failed:`, message)
      results.push({ id: broker.id, slug: broker.slug, success: false, error: message })

      // Still wait before next request even on failure
      await wait(500)
    }
  }

  // Invalidate the broker list cache so the new logos appear immediately
  revalidateTag("brokers", "infinite")

  await db.$disconnect()

  const succeeded = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  return Response.json({
    success: true,
    processed: results.length,
    succeeded,
    failed,
    details: results,
  })
}
