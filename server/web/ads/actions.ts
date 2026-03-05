"use server"

import { getDomain } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import z from "zod"
import { AdType, type Prisma } from "~/.generated/prisma/client"
import { adsConfig } from "~/config/ads"
import { siteConfig } from "~/config/site"
import { fetchAndUploadMedia } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import type { AdOne } from "~/server/web/ads/payloads"
import { findActiveAds } from "~/server/web/ads/queries"
import { createAdDetailsSchema, createPreCheckoutAdSchema } from "~/server/web/shared/schema"
import { stripe } from "~/services/stripe"
import { redirect } from "next/navigation"
import { getServerSession } from "~/lib/auth"

const findAdWithFallbackSchema = z.object({
  type: z.enum(AdType),
  explicitAd: z
    .object({
      type: z.enum(AdType),
      websiteUrl: z.url(),
      name: z.string(),
      description: z.string().nullish(),
      buttonLabel: z.string().nullish(),
      faviconUrl: z.url().nullish(),
      bannerUrl: z.url().nullish(),
    })
    .nullish(),
  fallback: z.array(z.enum(["all", "default"])).default(["all", "default"]),
})

/**
 * Finds an ad based on the provided parameters.
 * @param input - The ad data to find.
 * @returns The ad that was found or null if not found.
 */
export const findAdWithFallback = actionClient
  .inputSchema(findAdWithFallbackSchema)
  .action(async ({ parsedInput: { type, explicitAd, fallback } }) => {
    const t = await getTranslations("ads")
    let ads: AdOne[] = []

    const defaultAd = {
      id: siteConfig.slug,
      type: AdType.All,
      websiteUrl: `${siteConfig.url}/advertise`,
      name: t("default_ad.name"),
      description: t("default_ad.description"),
      buttonLabel: t("default_ad.button_label", { siteName: siteConfig.name }),
      faviconUrl: "/favicon.png",
      bannerUrl: null,
    } satisfies AdOne

    if (!adsConfig.enabled) {
      return null
    }

    if (explicitAd !== undefined) {
      // If ad is explicitly provided, use it directly
      return explicitAd as AdOne | null
    }

    if (type) {
      // Try to find ad for specific type
      ads = await findActiveAds({ where: { type } })
    }

    if (!ads.length && fallback.includes("all")) {
      // Try fallback to "All" type if enabled and specific type not found
      ads = await findActiveAds({ where: { type: "All" } })
    }

    if (!ads.length && fallback.includes("default")) {
      // Try fallback to default ad if enabled and no ad found
      return defaultAd
    }

    if (!ads.length) {
      // Return null if no ads found
      return null
    }

    if (ads.length === 1) {
      return ads[0]
    }

    // Return a random ad from the matching ones
    return ads[Math.floor(Math.random() * ads.length)]
  })

export const createAdFromCheckout = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createAdDetailsSchema(t)
  })
  .action(async ({ parsedInput: { sessionId, ...adDetails }, ctx: { db, revalidate } }) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const email = session.customer_details?.email ?? ""
    const ads: Omit<Omit<Prisma.AdCreateInput, "email">, keyof typeof adDetails>[] = []

    if (session.status !== "complete") {
      throw new Error("Checkout session is not complete")
    }

    const adDomain = getDomain(adDetails.websiteUrl)
    const faviconPath = `ads/${adDomain}/favicon`

    // Upload favicon
    const faviconUrl = adDetails.faviconUrl || (await fetchAndUploadMedia(adDetails.websiteUrl, faviconPath, "favicon"))

    // Check if ads already exist for specific sessionId
    const existingAds = await db.ad.findMany({
      where: { sessionId },
    })

    // If ads already exist, update them
    if (existingAds.length) {
      await db.ad.updateMany({
        where: { sessionId },
        data: { ...adDetails, faviconUrl, status: "Pending" },
      })

      // Revalidate the cache
      revalidate({ tags: ["ads"] })

      return { success: true }
    }

    switch (session.mode) {
      // Handle one-time payment ads
      case "payment": {
        if (!session.metadata?.ads) {
          throw new Error("Invalid session for ad creation")
        }

        const adsSchema = z.array(
          z.object({
            type: z.enum(AdType),
            startsAt: z.coerce.number().transform(date => new Date(date)),
            endsAt: z.coerce.number().transform(date => new Date(date)),
          }),
        )

        // Parse the ads from the session metadata
        const parsedAds = adsSchema.parse(JSON.parse(session.metadata.ads))

        // Add ads to create later
        ads.push(...parsedAds)

        break
      }

      default: {
        throw new Error("Invalid session for ad creation")
      }
    }

    // Create ads in a transaction
    await db.$transaction(
      ads.map(ad => db.ad.create({ data: { ...ad, ...adDetails, email, faviconUrl, sessionId, status: "Pending" } })),
    )

    // Revalidate the cache
    revalidate({ tags: ["ads"] })

    return { success: true }
  })

export const createDraftAdAndCheckout = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createPreCheckoutAdSchema(t)
  })
  .action(
    async ({
      parsedInput: {
        lineItems,
        successUrl,
        cancelUrl,
        mode,
        metadata,
        coupon,
        name,
        description,
        websiteUrl,
        buttonLabel,
        faviconUrl,
        bannerUrl,
      },
      ctx: { db },
    }) => {
      const session = await getServerSession()
      const customerEmail = session?.user.email

      if (!session?.user || !customerEmail) {
        throw new Error("You must be logged in to create an ad")
      }

      // Create checkout session
      const checkout = await stripe.checkout.sessions.create({
        mode,
        metadata,
        line_items: lineItems,
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        customer_creation: mode === "payment" ? "if_required" : undefined,
        invoice_creation: mode === "payment" ? { enabled: true } : undefined,
        subscription_data: mode === "subscription" && metadata ? { metadata } : undefined,
        allow_promotion_codes: coupon ? undefined : true,
        discounts: coupon ? [{ coupon }] : undefined,
        success_url: `${siteConfig.url}${successUrl}?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl ? `${siteConfig.url}${cancelUrl}?cancelled=true` : undefined,
        customer_email: customerEmail,
      })

      if (!checkout.url || !checkout.id) {
        throw new Error("Unable to create a new Stripe Checkout Session.")
      }

      // Upload favicon
      const adDomain = getDomain(websiteUrl)
      const faviconPath = `ads/${adDomain}/favicon`
      const resolvedFaviconUrl = faviconUrl || (await fetchAndUploadMedia(websiteUrl, faviconPath, "favicon"))

      let parsedAds: Omit<
        Omit<Prisma.AdCreateInput, "email">,
        "sessionId" | "name" | "description" | "websiteUrl" | "buttonLabel" | "faviconUrl" | "bannerUrl"
      >[] = []

      if (mode === "payment" && metadata?.ads) {
        const adsSchema = z.array(
          z.object({
            type: z.enum(AdType),
            startsAt: z.coerce.number().transform(date => new Date(date)),
            endsAt: z.coerce.number().transform(date => new Date(date)),
          }),
        )

        parsedAds = adsSchema.parse(JSON.parse(metadata.ads))
      }

      const adDetails = {
        name,
        description,
        websiteUrl,
        buttonLabel,
        sessionId: checkout.id,
        email: customerEmail,
        faviconUrl: resolvedFaviconUrl,
        bannerUrl,
      }

      // Create Draft ad records, one per line item mapped in metadata
      if (parsedAds.length > 0) {
        await db.$transaction(
          parsedAds.map(ad => db.ad.create({ data: { ...ad, ...adDetails } })),
        )
      }

      // Redirect to the checkout session url
      redirect(checkout.url)
    },
  )

