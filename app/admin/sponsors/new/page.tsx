import { SponsorForm } from "~/app/admin/sponsors/_components/sponsor-form"
import { Wrapper } from "~/components/common/wrapper"

export default function () {
  return (
    <Wrapper size="md" gap="sm">
      <SponsorForm title="New sponsor" />
    </Wrapper>
  )
}
