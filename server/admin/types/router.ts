import { adminProcedure } from "~/lib/orpc";

export const typesRouter = {
  lookup: adminProcedure.handler(async ({ context: { db } }) => {
    return db.type.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }),
};
