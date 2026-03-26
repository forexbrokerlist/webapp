import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { env } from "~/env";
import {
  notifyAdminOfNewAd,
  notifyAdminOfPremiumTool,
  notifySubmitterOfPremiumTool,
} from "~/lib/notifications";
import { db } from "~/services/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔔 Cregis Webhook received:", JSON.stringify(body, null, 2));

    const { event_type, data: dataString } = body;
    console.log("🚀 ~ POST ~ event_type:", event_type, dataString);

    if (!event_type || !dataString) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Parse the data string to object (Cregis sends it as a stringified JSON)
    let data;
    try {
      data =
        typeof dataString === "string" ? JSON.parse(dataString) : dataString;
    } catch (e) {
      console.error("❌ Failed to parse webhook data:", e);
      return new Response("Invalid data format", { status: 400 });
    }

    const orderId = data.order_id;
    if (!orderId) {
      return new Response("Missing order_id", { status: 400 });
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { orderId },
      include: {
        user: true,
        broker: true,
        plan: true,
      },
    });

    if (!payment) {
      console.warn("⚠️ No payment found for orderId:", orderId);
      return new Response("Payment not found", { status: 404 });
    }

    const metadata = payment.metadata as Record<string, any> | null;

    switch (event_type) {
      case "paid": {
        console.log("💰 Payment Confirmed for:", orderId);

        // Mark payment as Paid
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "Paid",
            transactionId: data.cregis_id,
          },
        });

        // ── Flow 1: Advertisement payment ──────────────────────────────────
        // Ad payments don't have a brokerId/planId; they have metadata.type = "ad"
        if (!payment.brokerId && !payment.planId) {
          console.log("📢 Ad payment flow for orderId:", orderId);

          // Ads are already created as Draft during checkout with sessionId = orderId.
          // Flip them to Pending so admin can review → publish.
          const updatedAds = await db.ad.updateMany({
            where: { sessionId: orderId },
            data: { status: "Pending" },
          });
          console.log(
            `✅ Marked ${updatedAds.count} ad(s) as Pending for sessionId: ${orderId}`,
          );

          revalidateTag("ads", "infinite");

          // Notify admin for each updated ad
          if (updatedAds.count > 0) {
            const ads = await db.ad.findMany({ where: { sessionId: orderId } });
            after(async () => {
              for (const ad of ads) {
                await notifyAdminOfNewAd(ad);
              }
            });
          }

          break;
        }

        // ── Flow 2: Broker plan subscription payment ───────────────────────
        if (payment.brokerId && payment.planId) {
          console.log("🏦 Plan subscription flow for orderId:", orderId);

          const endsAt = new Date();
          endsAt.setDate(endsAt.getDate() + (payment.plan?.durationDays ?? 30));

          await db.brokerSubscription.create({
            data: {
              broker: { connect: { id: payment.brokerId } },
              plan: { connect: { id: payment.planId } },
              startsAt: new Date(),
              endsAt,
              status: "Active",
            },
          });
          console.log(
            `✅ BrokerSubscription created for broker ${payment.brokerId}, plan ${payment.planId}`,
          );

          // Optional: upgrade a tool's tier if specified in metadata
          const toolSlug = metadata?.tool;
          if (toolSlug) {
            const tool = await db.tool.update({
              where: { slug: toolSlug },
              data: { tier: metadata?.tier || "Standard" },
            });

            revalidateTag("tools", "infinite");

            after(async () => {
              await notifySubmitterOfPremiumTool(tool);
              await notifyAdminOfPremiumTool(tool);
            });
          }
        } else {
          console.warn(
            "⚠️ Payment has partial brokerId/planId — skipping subscription creation",
            {
              brokerId: payment.brokerId,
              planId: payment.planId,
            },
          );
        }

        break;
      }

      case "expired": {
        console.log("⌛ Payment expired:", orderId);
        // await db.payment.update({
        //   where: { id: payment.id },
        //   data: { status: "Cancelled" },
        // })
        // break

        console.log("💰 Payment Confirmed for:", orderId);

        // Mark payment as Paid
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "Paid",
            transactionId: data.cregis_id,
          },
        });

        // ── Flow 1: Advertisement payment ──────────────────────────────────
        // Ad payments don't have a brokerId/planId; they have metadata.type = "ad"
        if (!payment.brokerId && !payment.planId) {
          console.log("📢 Ad payment flow for orderId:", orderId);

          // Ads are already created as Draft during checkout with sessionId = orderId.
          // Flip them to Pending so admin can review → publish.
          const updatedAds = await db.ad.updateMany({
            where: { sessionId: orderId },
            data: { status: "Pending" },
          });
          console.log(
            `✅ Marked ${updatedAds.count} ad(s) as Pending for sessionId: ${orderId}`,
          );

          revalidateTag("ads", "infinite");

          // Notify admin for each updated ad
          if (updatedAds.count > 0) {
            const ads = await db.ad.findMany({ where: { sessionId: orderId } });
            after(async () => {
              for (const ad of ads) {
                await notifyAdminOfNewAd(ad);
              }
            });
          }

          break;
        }

        // ── Flow 2: Broker plan subscription payment ───────────────────────
        if (payment.brokerId && payment.planId) {
          console.log("🏦 Plan subscription flow for orderId:", orderId);

          const endsAt = new Date();
          endsAt.setDate(endsAt.getDate() + (payment.plan?.durationDays ?? 30));

          await db.brokerSubscription.create({
            data: {
              broker: { connect: { id: payment.brokerId } },
              plan: { connect: { id: payment.planId } },
              startsAt: new Date(),
              endsAt,
              status: "Active",
            },
          });
          console.log(
            `✅ BrokerSubscription created for broker ${payment.brokerId}, plan ${payment.planId}`,
          );

          // Optional: upgrade a tool's tier if specified in metadata
          const toolSlug = metadata?.tool;
          if (toolSlug) {
            const tool = await db.tool.update({
              where: { slug: toolSlug },
              data: { tier: metadata?.tier || "Standard" },
            });

            revalidateTag("tools", "infinite");

            after(async () => {
              await notifySubmitterOfPremiumTool(tool);
              await notifyAdminOfPremiumTool(tool);
            });
          }
        } else {
          console.warn(
            "⚠️ Payment has partial brokerId/planId — skipping subscription creation",
            {
              brokerId: payment.brokerId,
              planId: payment.planId,
            },
          );
        }

        break;
      }

      default:
        console.log(`❓ Unknown event_type: ${event_type}`);
    }

    return new Response("success");
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(`Webhook handler failed: ${error}`, { status: 500 });
  }
}
