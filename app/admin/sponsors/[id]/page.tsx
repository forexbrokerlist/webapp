import { notFound } from "next/navigation"
import { SponsorForm } from "~/app/admin/sponsors/_components/sponsor-form"
import { Wrapper } from "~/components/common/wrapper"
import { findSponsorById } from "~/server/admin/sponsors/queries"

export default async function ({ params }: PageProps<"/admin/sponsors/[id]">) {
  const { id } = await params
  const sponsor = await findSponsorById(id)

  if (!sponsor) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <SponsorForm title="Update sponsor" sponsor={sponsor} />
    </Wrapper>
  )
}
