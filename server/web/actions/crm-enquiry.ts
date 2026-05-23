"use server"

import { tryCatch } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import { isRateLimited } from "~/lib/rate-limiter"
import { actionClient } from "~/lib/safe-actions"
import { sendSlackNotification } from "~/services/slack"
import { z } from "zod"

const crmEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Invalid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const submitCrmEnquiry = actionClient
  .schema(crmEnquirySchema)
  .action(async ({ parsedInput: { name, email, phone, message } }) => {
    // Note: We'll use translations if needed, but for now we'll stick to English
    // since the UI is English.

    if (await isRateLimited("crm_enquiry")) {
      throw new Error("Too many requests. Please try again later.")
    }

    const { db } = await import("~/services/db")

    const { error } = await tryCatch(
      db.cRMEnquiry.create({
        data: {
          name,
          email,
          phone,
          message,
        },
      }),
    )

    if (error) {
      console.error("Failed to save CRM Enquiry:", error)
      throw new Error("Failed to submit enquiry. Please try again later.")
    }

    // Notify Slack on every new CRM enquiry submission
    await sendSlackNotification(
      `📋 *New CRM Enquiry*\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nType: CRM`,
    )

    return "Your enquiry has been submitted successfully! Our team will get in touch shortly."
  })
