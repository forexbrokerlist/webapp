import { notFound } from "next/navigation"
import { TypeForm } from "~/app/admin/types/_components/type-form"
import { Wrapper } from "~/components/common/wrapper"
import { findTypeById } from "~/server/admin/types/queries"

export default async function ({ params }: PageProps<"/admin/types/[id]">) {
  const { id } = await params
  const type = await findTypeById(id)

  if (!type) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <TypeForm title="Update type" type={type} />
    </Wrapper>
  )
}
