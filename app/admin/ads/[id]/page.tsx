import { notFound } from "next/navigation"
import { AdForm } from "~/app/admin/ads/_components/ad-form"
import { Wrapper } from "~/components/common/wrapper"
import { findAdById } from "~/server/admin/ads/queries"

export default async function ({ params }: PageProps<"/admin/ads/[id]">) {
  const { id } = await params
  const ad = await findAdById(id)

  if (!ad) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <AdForm title="Update ad" ad={ad} />
    </Wrapper>
  )
}
