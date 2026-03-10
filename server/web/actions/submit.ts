"use server"

import { checkUrlAvailability, getDomain, tryCatch } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import { after } from "next/server"
import { siteConfig } from "~/config/site"
import { isDev } from "~/env"
import { notifyAdminOfNewBroker } from "~/lib/notifications"
import { isRateLimited } from "~/lib/rate-limiter"
import { userActionClient } from "~/lib/safe-actions"
import { createSubmitBrokerSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { createResendContact } from "~/services/resend"

export const submitBroker = userActionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createSubmitBrokerSchema(t)
  })
  .action(async ({ parsedInput: { newsletterOptIn, categoryIds, subcategoryIds, tagIds, ...data }, ctx: { user } }) => {
    const t = await getTranslations("forms.submit")
    const userAgent = `Mozilla/5.0 (compatible; ${siteConfig.name}/1.0; +${siteConfig.url})`

    // Rate limiting check
    if (user.role !== "admin" && (await isRateLimited("submission"))) {
      throw new Error(t("errors.rate_limited"))
    }

    if (data.broker_website && data.broker_website.startsWith("http")) {
      // Check if the website URL is accessible
      if (!(await checkUrlAvailability(data.broker_website, { userAgent }))) {
        throw new Error(t("errors.url_not_accessible"))
      }
    }

    if (newsletterOptIn) {
      const [firstName, ...restOfName] = user.name.trim().split(/\s+/)
      const lastName = restOfName.join(" ")

      try {
        await db.newsletter.upsert({
          where: { email: user.email },
          update: {
            firstName,
            lastName
          },
          create: {
            email: user.email,
            firstName,
            lastName
          }
        })
      } catch (error) {
        console.error("Failed to save newsletter subscription:", error)
        // Log but don't fail the whole user submission process just for the newsletter
      }
    }

    const slug = data.broker_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

    // Save the broker to the database
    const { data: broker, error } = await tryCatch(
      db.brokers.create({
        data: {
          ...data,
          slug,
          categories: {
            connect: categoryIds?.map((id: string) => ({ id })),
          },
          subcategories: {
            connect: subcategoryIds?.map((id: string) => ({ id })),
          },
          tags: {
            connect: tagIds?.map((id: string) => ({ id })),
          },
        },
      }),
    )

    if (error) {
      throw isDev ? error : new Error(t("errors.failed_submission"))
    }

    if (broker) {
      after(async () => await notifyAdminOfNewBroker(broker))
    }

    return broker
  })
