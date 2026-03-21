import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { env } from "~/env"
import { notifyAdminOfNewAd, notifyAdminOfPremiumTool, notifySubmitterOfPremiumTool } from "~/lib/notifications"
import { db } from "~/services/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("🔔 Cregis Webhook received:", JSON.stringify(body, null, 2))

    const { event_type, data: dataString } = body

    if (!event_type || !dataString) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Parse the data string to object (Cregis sends it as a stringified JSON)
    let data
    try {
      data = typeof dataString === "string" ? JSON.parse(dataString) : dataString
    } catch (e) {
      console.error("❌ Failed to parse webhook data:", e)
      return new Response("Invalid data format", { status: 400 })
    }

    const orderId = data.order_id
    if (!orderId) {
      return new Response("Missing order_id", { status: 400 })
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { orderId },
      include: {
        user: true,
        broker: true,
        plan: true,
      },
    })

    if (!payment) {
      console.warn("⚠️ No payment found for orderId:", orderId)
      return new Response("Payment not found", { status: 404 })
    }

    switch (event_type) {
      case "paid": {
        console.log("💰 Payment Confirmed for:", orderId)

        // Update payment status
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "Paid",
            transactionId: data.cregis_id, // Using cregis_id as transactionId
          },
        })

        // Create or Update Broker Subscription
        const endsAt = new Date()
        endsAt.setDate(endsAt.getDate() + payment.plan.durationDays)

        const subscription = await db.brokerSubscription.create({
          data: {
            brokerId: payment.brokerId,
            planId: payment.planId,
            startsAt: new Date(),
            endsAt,
            status: "Active",
          },
        })

        // Handle additional logic based on metadata (e.g., Tool Tier, Ads)
        const metadata = payment.metadata as any
        const toolSlug = metadata?.tool

        if (toolSlug) {
           const tool = await db.tool.update({
             where: { slug: toolSlug },
             data: { tier: metadata.tier || "Standard" }
           })

           // Revalidate cache
           revalidateTag("tools", "infinite")

           // Notifications (from reference code logic)
           after(async () => {
             await notifySubmitterOfPremiumTool(tool)
             await notifyAdminOfPremiumTool(tool)
           })
        }

        const adId = metadata?.adId
        if (adId) {
          const ad = await db.ad.update({
            where: { id: adId },
            data: { status: "Pending" }
          })
          
          revalidateTag("ads", "infinite")
          after(async () => await notifyAdminOfNewAd(ad))
        }

        break
      }

      case "expired": {
        console.log("⌛ Payment expired:", orderId)
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "Cancelled" },
        })
        break
      }

      default:
        console.log(`❓ Unknown event_type: ${event_type}`)
    }

    return new Response("success")
  } catch (error) {
    console.error("Webhook processing error:", error)
    return new Response(`Webhook handler failed: ${error}`, { status: 500 })
  }
}
