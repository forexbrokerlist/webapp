import { adminProcedure } from "~/lib/orpc";
import { adRouter } from "~/server/admin/ads/router";
import { categoryRouter } from "~/server/admin/categories/router";
import { subcategoryRouter } from "~/server/admin/subcategories/router";
import { metricRouter } from "~/server/admin/metrics/router";
import { reportRouter } from "~/server/admin/reports/router";
import { sponsorRouter } from "~/server/admin/sponsors/router";
import { tagRouter } from "~/server/admin/tags/router";
import { brokerRouter } from "~/server/admin/brokers/router";
import { userRouter } from "~/server/admin/users/router";
import { postRouter } from "~/server/admin/posts/router";
import { newsletterRouter } from "~/server/admin/newsletter/router";
import { contactsRouter } from "~/server/admin/contacts/router";
import { paymentRouter } from "~/server/admin/payments/router";

// -----------------------------------------------------------------------------
// Health-check procedure to verify oRPC infrastructure
// -----------------------------------------------------------------------------
const ping = adminProcedure.handler(async () => {
  return { status: "ok" as const, timestamp: new Date().toISOString() };
});

// -----------------------------------------------------------------------------
// Admin router
// -----------------------------------------------------------------------------
export const adminRouter = {
  ping,
  metrics: metricRouter,
  brokers: brokerRouter,
  categories: categoryRouter,
  subcategories: subcategoryRouter,
  tags: tagRouter,
  ads: adRouter,
  users: userRouter,
  reports: reportRouter,
  sponsors: sponsorRouter,
  posts: postRouter,
  newsletter: newsletterRouter,
  contacts: contactsRouter,
  payments: paymentRouter,
};

export type AdminRouter = typeof adminRouter;
