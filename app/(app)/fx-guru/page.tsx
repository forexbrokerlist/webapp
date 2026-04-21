import type { Metadata } from "next"
import { FxGuruLanding } from "~/components/web/tools/fx-guru-chat"

export const metadata: Metadata = {
  title: "FxGURU - AI Market Assistant",
  description: "Get actionable insights from stock charts and market analysis",
}

export default function FxGuruPage() {
  return (
    <div>
      <FxGuruLanding />
    </div>
  )
}
