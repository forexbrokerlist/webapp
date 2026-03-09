import { notFound } from "next/navigation"
import { SubcategoryForm } from "~/app/admin/subcategories/_components/subcategory-form"
import { Wrapper } from "~/components/common/wrapper"
import { findSubcategoryById } from "~/server/admin/subcategories/queries"

export default async function ({ params }: PageProps<"/admin/subcategories/[id]">) {
  const { id } = await params
  const subcategory = await findSubcategoryById(id)

  if (!subcategory) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <SubcategoryForm title="Update subcategory" subcategory={subcategory} />
    </Wrapper>
  )
}
