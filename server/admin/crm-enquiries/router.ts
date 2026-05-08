import { adminProcedure } from "~/lib/orpc"
import { listCRMEnquiries, deleteCRMEnquiry } from "./queries"
import { crmEnquiryListSchema, crmEnquiryDeleteSchema } from "./schema"

export const crmEnquiryRouter = {
  list: adminProcedure
    .input(crmEnquiryListSchema)
    .handler(async ({ input }) => {
      return listCRMEnquiries(input)
    }),
  delete: adminProcedure
    .input(crmEnquiryDeleteSchema)
    .handler(async ({ input }) => {
      return deleteCRMEnquiry(input)
    }),
}
