import { adminProcedure } from "~/lib/orpc"
import { deleteNewsletter, fetchNewsletters } from "./queries"
import { deleteNewsletterSchema, fetchNewslettersSchema } from "./schema"

export const newsletterRouter = {
  list: adminProcedure
    .input(fetchNewslettersSchema)
    .handler(async ({ input }) => {
      return fetchNewsletters(input)
    }),

  delete: adminProcedure
    .input(deleteNewsletterSchema)
    .handler(async ({ input }) => {
      return deleteNewsletter(input.id)
    }),
}
