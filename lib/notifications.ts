import { type Tool, ToolStatus, type Brokers } from "~/.generated/prisma/client"
import { siteConfig } from "~/config/site"
import { EmailAdminSubmissionPremium } from "~/emails/admin-submission-premium"
import { EmailAdminAdSubmission } from "~/emails/admin-ad-submission"
import { EmailAdminBrokerSubmission } from "~/emails/admin-broker-submission"
import { EmailAdStatusChange } from "~/emails/ad-status-change"
import { EmailSubmission } from "~/emails/submission"
import { EmailSubmissionPremium } from "~/emails/submission-premium"
import { EmailSubmissionPublished } from "~/emails/submission-published"
import { EmailSubmissionScheduled } from "~/emails/submission-scheduled"
import { sendEmail } from "~/lib/email"
import { countSubmittedTools } from "~/server/web/tools/queries"
import { db } from "~/services/db"

/**
 * Get all admin emails from the database
 * Returns a list of emails for users with the "admin" role
 * Fallbacks to siteConfig.email if no admins found
 */
const getAdminEmails = async () => {
  const admins = await db.user.findMany({
    where: { role: "admin" },
    select: { email: true },
  })

  const adminEmails = admins.map((admin) => admin.email).filter(Boolean)
  console.log("🚀 ~ getAdminEmails ~ adminEmails:", adminEmails)

  if (adminEmails.length === 0) {
    return [siteConfig.email]
  }

  return adminEmails
}

/**
 * Notify the submitter of a tool submission
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolSubmitted = async (tool: Tool) => {
  if (!tool.submitterEmail) {
    return
  }

  const to = tool.submitterEmail
  const subject = `🙌 Thanks for submitting ${tool.name}!`
  const queue = await countSubmittedTools({})

  return await sendEmail({
    to,
    subject,
    react: EmailSubmission({ to, tool, queue }),
  })
}

/**
 * Notify the submitter of a tool scheduled for publication
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolScheduled = async (tool: Tool) => {
  if (!tool.submitterEmail || !tool.publishedAt || tool.status !== ToolStatus.Scheduled) {
    return
  }

  const to = tool.submitterEmail
  const subject = `Great news! ${tool.name} is scheduled for publication on ${siteConfig.name} 🎉`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionScheduled({ to, tool }),
  })
}

/**
 * Notify the submitter of a tool published
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolPublished = async (tool: Tool) => {
  if (!tool.submitterEmail || !tool.publishedAt || tool.status !== ToolStatus.Published) {
    return
  }

  const to = tool.submitterEmail
  const subject = `${tool.name} has been published on ${siteConfig.name} 🎉`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionPublished({ to, tool }),
  })
}

/**
 * Notify the submitter of a premium tool
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfPremiumTool = async (tool: Tool) => {
  if (!tool.submitterEmail) {
    return
  }

  const to = tool.submitterEmail
  const subject = `🙌 Thank you for upgrading ${tool.name}!`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionPremium({ to, tool }),
  })
}

/**
 * Notify the admin of a premium tool
 *
 * @param tool - The tool to notify the admin of
 * @returns The email that was sent
 */
export const notifyAdminOfPremiumTool = async (tool: Tool) => {
  const adminEmails = await getAdminEmails()
  const subject = `New ${tool.tier.toLowerCase()} tool: ${tool.name}`

  return await Promise.all(
    adminEmails.map((to) =>
      sendEmail({
        to,
        subject,
        replyTo: tool.submitterEmail ?? undefined,
        react: EmailAdminSubmissionPremium({ to, tool }),
      }),
    ),
  )
}

/**
 * Notify the admin of a new broker submission
 *
 * @param broker - The broker to notify the admin of
 * @returns The emails that were sent
 */
export const notifyAdminOfNewBroker = async (broker: Brokers) => {
  console.log("🚀 ~ notifyAdminOfNewBroker ~ broker:", broker)
  const adminEmails = await getAdminEmails()
  console.log("🚀 ~ notifyAdminOfNewBroker ~ adminEmails:", adminEmails)
  const subject = `New Broker Submission: ${broker.broker_name}`

  return await Promise.all(
    adminEmails.map((to) =>
      sendEmail({
        to,
        subject,
        replyTo: broker.submitterEmail ?? undefined,
        react: EmailAdminBrokerSubmission({ to, broker }),
      }),
    ),
  )
}

/**
 * Notify the admin of a new ad submission
 *
 * @param ad - The ad to notify the admin of
 * @returns The email that was sent
 */
export const notifyAdminOfNewAd = async (ad: any) => {
  console.log("🚀 ~ notifyAdminOfNewAd ~ ad:", ad)
  const adminEmails = await getAdminEmails()
  console.log("🚀 ~ notifyAdminOfNewAd ~ adminEmails:", adminEmails)
  const subject = `New Ad Submission: ${ad.name}`

  return await Promise.all(
    adminEmails.map((to) =>
      sendEmail({
        to,
        subject,
        replyTo: ad.email ?? undefined,
        react: EmailAdminAdSubmission({ to, ad }),
      }),
    ),
  )
}

/**
 * Notify the advertiser of an ad status change
 *
 * @param ad - The ad to notify the advertiser of
 * @returns The email that was sent
 */
export const notifyAdvertiserOfAdStatusChange = async (ad: any) => {
  console.log("🚀 ~ notifyAdvertiserOfAdStatusChange ~ ad:", ad)
  if (!ad.email) {
    return
  }

  const to = ad.email
  const isApproved = ad.status === "Scheduled" || ad.status === "Published"
  const statusLabel = isApproved ? "Approved" : "Rejected"
  const subject = `Your ad "${ad.name}" has been ${statusLabel.toLowerCase()} - ${siteConfig.name}`

  return await sendEmail({
    to,
    subject,
    react: EmailAdStatusChange({ ad }),
  })
}
