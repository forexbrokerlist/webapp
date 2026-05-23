"use server"

import { tryCatch } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import { isRateLimited } from "~/lib/rate-limiter"
import { actionClient } from "~/lib/safe-actions"
import { createContactUsSchema } from "~/server/web/shared/schema"
import { sendSlackNotification } from "~/services/slack"

export const submitContactUs = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createContactUsSchema(t)
  })
  .action(async ({ parsedInput: { name, email, subject, message } }) => {
    const t = await getTranslations("forms.contact")

    if (await isRateLimited("contact")) {
      throw new Error(t("errors.rate_limited"))
    }

    const { db } = await import("~/services/db")

    const { error } = await tryCatch(
      db.contactUs.create({
        data: {
          name,
          email,
          subject: subject?.trim() ? subject.trim() : null,
          message,
        },
      }),
    )

    if (error) {
      console.error("Failed to save contact request:", error)
      throw new Error(t("errors.failed"))
    }

    // Notify Slack on every new contact form submission
    await sendSlackNotification(
      `📬 *New Contact Form Submission*\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\nMessage: ${message}\nType: Contact us`,
    )

    return t("success_message")
  })

