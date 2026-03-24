"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { siteConfig } from "~/config/site";
import { env } from "~/env";
import { getServerSession } from "~/lib/auth";
import { actionClient } from "~/lib/safe-actions";
import { checkoutSchema, type CheckoutInput } from "~/server/web/products/schema";
import { cregis } from "~/services/cregis";
import { db } from "~/services/db";

export const createCheckout = actionClient
  .inputSchema(checkoutSchema)
  .action(
    async ({
      parsedInput,
    }: {
      parsedInput: CheckoutInput;
    }) => {
      const { lineItems, successUrl, cancelUrl, mode, metadata, coupon } = parsedInput;
      const session = await getServerSession();
      if (!session) {
        throw new Error("Unauthorized");
      }
      const customerEmail = session.user.email;
      const customerName = session.user.name ?? "User";
      const userId = session.user.id;

      let totalAmount = 0;
      let planId: string | undefined;
      let brokerId: number | undefined;

      // For metadata, we expect brokerId if it's a broker-related payment
      if (metadata?.brokerId) {
        brokerId = parseInt(metadata.brokerId);
      }

      // Process line items to calculate total amount and identify the main plan
      for (const item of lineItems) {
        if ("price" in item) {
          // Find the plan by cregisProductId or ID
          const plan = await db.plan.findFirst({
            where: {
              OR: [{ id: item.price }, { cregisProductId: item.price }],
            },
          });

          if (!plan) {
            throw new Error(`Plan not found for price: ${item.price}`);
          }

          totalAmount += plan.price * item.quantity;
          planId = plan.id;
        } else if ("price_data" in item) {
          totalAmount += (item.price_data.unit_amount / 100) * item.quantity;
        }
      }

      if (!planId) {
        // If no planId was found via the 'price' field, check if we can find one via metadata
        planId = metadata?.planId;
      }

      if (!planId || !brokerId) {
        // We need these for our internal Payment record
        // If they aren't provided, we might have issues later in the webhook
      }

      const nonce = crypto.randomBytes(3).toString("hex");
      const timestamp = Math.floor(Date.now() / 1000);
      const orderId = `${nonce}${timestamp}`;

      // Create a Payment record in the DB
      // Use relation connect for the required `user` relation
      if (planId && brokerId) {
        await db.payment.create({
          data: {
            user: { connect: { id: userId } },
            // Connect broker and plan relations (checked create input expects relation objects)
            broker: { connect: { id: brokerId } },
            plan: { connect: { id: planId } },
            amount: totalAmount,
            currency: "USD",
            gateway: "cregis",
            orderId,
            status: "Pending",
            metadata: metadata
              ? JSON.parse(JSON.stringify(metadata))
              : undefined,
          },
        });
      }

      const response = await cregis.createCheckout({
        order_id: orderId,
        order_amount: totalAmount,
        order_currency: "USD",
        callback_url: `${env.CREJIS_WEBHOOK_URL}cregis/webhooks`,
        remark: JSON.stringify({ planId, brokerId, ...metadata }),
        payer_id: userId,
        payer_name: customerName,
        payer_email: customerEmail,
        timestamp,
        nonce,
        valid_time: 10, // 10 minutes
        success_url: `${siteConfig.url}${successUrl}${successUrl.includes("?") ? "&" : "?"}order_id=${orderId}`,
        cancel_url: cancelUrl
          ? `${siteConfig.url}${cancelUrl}${cancelUrl.includes("?") ? "&" : "?"}cancelled=true`
          : undefined,
      });

      if (response.code !== "00000" || !response.data.checkout_url) {
        throw new Error(`Cregis Error: ${response.msg}`);
      }

      // Redirect to the checkout session url
      redirect(response.data.checkout_url);
    },
  );
