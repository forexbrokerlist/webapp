"use server"

import { checkUrlAvailability, getDomain, tryCatch } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import { siteConfig } from "~/config/site"
import { isDev } from "~/env"
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
  .action(async ({ parsedInput: { newsletterOptIn, ...data }, ctx: { user } }) => {
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

      await createResendContact({
        email: user.email,
        firstName,
        lastName,
      })
    }

    const slug = data.broker_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

    // Save the broker to the database
    const { data: broker, error } = await tryCatch(
      db.brokers.create({
        data: {
          ...data,
          slug,
        },
      }),
    )

    if (error) {
      throw isDev ? error : new Error(t("errors.failed_submission"))
    }

    return broker
  })
