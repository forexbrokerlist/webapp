import { CategoryList } from "~/components/web/categories/category-list"
import { findCategories } from "~/server/web/categories/queries"

const CategoryQuery = async () => {
  const categories = await findCategories({ all: true })

  return <CategoryList categories={categories} />
}

export { CategoryQuery }
