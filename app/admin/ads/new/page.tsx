import { AdForm } from "~/app/admin/ads/_components/ad-form"
import { Wrapper } from "~/components/common/wrapper"

export default function () {
  return (
    <Wrapper size="md" gap="sm">
      <AdForm title="Create ad" />
    </Wrapper>
  )
}
