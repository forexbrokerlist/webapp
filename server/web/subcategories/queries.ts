import { db } from "~/services/db"

export const findSubcategories = async () => {
  return db.subcategory.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      categoryId: true,
    },
  })
}
