import { SubcategoryForm } from "~/app/admin/subcategories/_components/subcategory-form"
import { Wrapper } from "~/components/common/wrapper"

export default function () {
  return (
    <Wrapper size="md" gap="sm">
      <SubcategoryForm title="Create subcategory" />
    </Wrapper>
  )
}
