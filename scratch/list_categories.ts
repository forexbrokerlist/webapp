import { db } from "../services/db"

async function listCategories() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    }
  })
  console.log(JSON.stringify(categories, null, 2))
}

listCategories()
  .catch(console.error)
  .finally(() => process.exit())
