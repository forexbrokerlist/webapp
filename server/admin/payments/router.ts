import { adminProcedure } from "~/lib/orpc"
import { findPayments } from "~/server/admin/payments/queries"
import { paymentListSchema } from "~/server/admin/payments/schema"

const list = adminProcedure.input(paymentListSchema).handler(async ({ input }) => {
  return findPayments(input)
})

export const paymentRouter = {
  list,
}
