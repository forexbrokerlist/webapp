import { env } from "~/env"

export async function sendSlackNotification(message: string): Promise<void> {
  const slackWebhookUrl = env.SLACK_WEBHOOK_URL

  if (!slackWebhookUrl) {
    console.warn("⚠️ SLACK_WEBHOOK_URL is not set. Skipping Slack notification.")
    return
  }

  try {
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    })
    console.log("📢 Slack notified:", message)
  } catch (error) {
    console.error("❌ Failed to send Slack notification:", error)
  }
}
