import { adminProcedure } from "~/lib/orpc"
import { findSubcategories, findSubcategoryList } from "~/server/admin/subcategories/queries"
import { subcategoryListSchema, subcategorySchema } from "~/server/admin/subcategories/schema"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"

const list = adminProcedure.input(subcategoryListSchema).handler(async ({ input }) => {
  return findSubcategories(input)
})

const lookup = adminProcedure.handler(async () => {
  return findSubcategoryList()
})

const upsert = adminProcedure
  .input(subcategorySchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, tools, ...data } = input
    const toolIds = tools?.map(id => ({ id }))

    const subcategory = id
      ? await db.subcategory.update({
          where: { id },
          data: {
            ...data,
            slug: data.slug || "",
            tools: { set: toolIds },
          },
        })
      : await db.subcategory.create({
          data: {
            ...data,
            slug: data.slug || "",
            tools: { connect: toolIds },
          },
        })

    revalidate({
      tags: ["subcategories", `subcategory-${subcategory.slug}`],
    })

    return subcategory
  })

const duplicate = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const subcategory = await db.subcategory.findUnique({
      where: { id },
      include: { tools: { select: { id: true } } },
    })

    if (!subcategory) {
      throw new Error("Subcategory not found")
    }

    const newSubcategory = await db.subcategory.create({
      data: {
        name: `${subcategory.name} (Copy)`,
        slug: "",
        label: subcategory.label,
        description: subcategory.description,
        categoryId: subcategory.categoryId,
        tools: { connect: subcategory.tools },
      },
    })

    revalidate({
      tags: ["subcategories"],
    })

    return newSubcategory
  })

const remove = adminProcedure
  .input(idsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    await db.subcategory.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      tags: ["subcategories"],
    })

    return true
  })

export const subcategoryRouter = {
  list,
  lookup,
  upsert,
  duplicate,
  remove,
}
