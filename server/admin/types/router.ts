import { adminProcedure } from "~/lib/orpc";
import { findTypes, findTypeList } from "~/server/admin/types/queries";
import { typeListSchema, typeSchema } from "~/server/admin/types/schema";
import { idSchema, idsSchema } from "~/server/admin/shared/schema";

const list = adminProcedure.input(typeListSchema).handler(async ({ input }) => {
  return findTypes(input);
});

const lookup = adminProcedure.handler(async () => {
  return findTypeList();
});

const upsert = adminProcedure
  .input(typeSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, brokers, ...data } = input;
    const brokerIds = brokers?.map((id) => ({ id: Number(id) }));

    const type = id
      ? await db.type.update({
          where: { id },
          data: {
            ...data,
            slug: data.slug || "",
            brokers: { set: brokerIds },
          },
        })
      : await db.type.create({
          data: {
            ...data,
            slug: data.slug || "",
            brokers: { connect: brokerIds },
          },
        });

    revalidate({
      tags: ["types", `type-${type.slug}`],
    });

    return type;
  });

const duplicate = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const type = await db.type.findUnique({
      where: { id },
      include: {
        brokers: { select: { id: true } },
      },
    });

    if (!type) {
      throw new Error("Type not found");
    }

    const newType = await db.type.create({
      data: {
        name: `${type.name} (Copy)`,
        slug: "",
        label: type.label,
        description: type.description,
        brokers: { connect: type.brokers.map((b) => ({ id: b.id })) },
      },
    });

    revalidate({
      tags: ["types"],
    });

    return newType;
  });

const remove = adminProcedure
  .input(idsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    await db.type.deleteMany({
      where: { id: { in: ids } },
    });

    revalidate({
      tags: ["types"],
    });

    return true;
  });

export const typesRouter = {
  list,
  lookup,
  upsert,
  duplicate,
  remove,
};
