import crypto from "crypto";
import { getDomain } from "@primoui/utils";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { AdType, Prisma } from "~/.generated/prisma/client";
import { siteConfig } from "~/config/site";
import { env } from "~/env";
import { getServerSession } from "~/lib/auth";
import { fetchAndUploadMedia } from "~/lib/media";
import { cregis } from "~/services/cregis";
import { db } from "~/services/db";
import { createPreCheckoutAdSchema } from "~/server/web/shared/schema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const customerEmail = session?.user.email;
    const customerName = session?.user.name ?? "User";
    const userId = session?.user.id;

    if (!session?.user || !customerEmail || !userId) {
      return NextResponse.json({ error: "You must be logged in to create an ad" }, { status: 401 });
    }

    const body = await req.json();
    const t = await getTranslations("schema");
    const schema = createPreCheckoutAdSchema(t);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }

    const {
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
      categoryId,
      subcategoryId,
    } = parsed.data;

    let totalAmount = 0;
    for (const item of lineItems) {
      if ("price_data" in item) {
        totalAmount += (item.price_data.unit_amount / 100) * item.quantity;
      }
    }

    const nonce = crypto.randomBytes(3).toString("hex");
    const timestamp = Math.floor(Date.now() / 1000);
    const orderId = `${nonce}${timestamp}`;

    // Create a Payment record in the DB
    await db.payment.create({
      data: {
        user: { connect: { id: userId } },
        amount: totalAmount,
        currency: "USD",
        gateway: "cregis",
        orderId,
        status: "Pending",
        metadata: { ...metadata, email: customerEmail } as any,
      },
    });

    const cregisResponse = await cregis.createCheckout({
      order_id: orderId,
      order_amount: totalAmount,
      order_currency: "USD",
      callback_url: `${env.CREJIS_WEBHOOK_URL}cregis/webhooks`,
      remark: JSON.stringify({ type: "ad", ...metadata }),
      payer_id: userId,
      payer_name: customerName,
      payer_email: customerEmail,
      timestamp,
      nonce,
      valid_time: 10,
      success_url: `${siteConfig.url}${successUrl}?sessionId=${orderId}`,
      cancel_url: cancelUrl ? `${siteConfig.url}${cancelUrl}?cancelled=true` : undefined,
    });

    if (cregisResponse.code !== "00000" || !cregisResponse.data.checkout_url) {
      return NextResponse.json({ error: `Cregis Error: ${cregisResponse.msg}` }, { status: 500 });
    }

    // Upload favicon (background)
    const adDomain = getDomain(websiteUrl);
    const faviconPath = `ads/${adDomain}/favicon`;
    const resolvedFaviconUrl =
      faviconUrl || (await fetchAndUploadMedia(websiteUrl, faviconPath, "favicon"));

    let parsedAds: Omit<
      Omit<Prisma.AdUncheckedCreateInput, "email">,
      | "sessionId"
      | "name"
      | "description"
      | "websiteUrl"
      | "buttonLabel"
      | "faviconUrl"
      | "bannerUrl"
    >[] = [];

    if (mode === "payment" && metadata?.ads) {
      const adsSchema = z.array(
        z.object({
          type: z.enum(AdType),
          startsAt: z.coerce.number().transform((date) => new Date(date)),
          endsAt: z.coerce.number().transform((date) => new Date(date)),
        }),
      );

      parsedAds = adsSchema.parse(JSON.parse(metadata.ads as string));
    }

    // Validate subcategoryId
    let resolvedSubcategoryId: string | undefined = undefined;
    if (subcategoryId) {
      const sub = await db.subcategory.findUnique({ where: { id: subcategoryId } });
      if (sub) {
        resolvedSubcategoryId = subcategoryId;
      }
    }

    const adDetails = {
      name,
      description,
      websiteUrl,
      buttonLabel,
      sessionId: orderId,
      email: customerEmail,
      faviconUrl: resolvedFaviconUrl,
      bannerUrl,
      categoryId,
      subcategoryId: resolvedSubcategoryId,
    };

    // Create Draft ad records
    if (parsedAds.length > 0) {
      await db.$transaction(
        parsedAds.map((ad) => db.ad.create({ data: { ...ad, ...adDetails } })),
      );
    }

    return NextResponse.json({ checkoutUrl: cregisResponse.data.checkout_url, orderId });
  } catch (error: any) {
    console.error("🚀 ~ Checkout API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
