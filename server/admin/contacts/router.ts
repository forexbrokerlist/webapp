import { adminProcedure } from "~/lib/orpc"
import { deleteContact, fetchContacts } from "./queries"
import { deleteContactSchema, fetchContactsSchema } from "./schema"

export const contactsRouter = {
  list: adminProcedure
    .input(fetchContactsSchema)
    .handler(async ({ input }) => {
      return fetchContacts(input)
    }),

  delete: adminProcedure
    .input(deleteContactSchema)
    .handler(async ({ input }) => {
      return deleteContact(input.id)
    }),
}
