import type { Metadata } from "next"
import { FxGuruLanding } from "~/components/web/tools/fx-guru-chat"

export const metadata: Metadata = {
  title: "FxGURU - AI Market Assistant",
  description: "Get actionable insights from stock charts and market analysis",
}

export default function FxGuruPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-80px)] bg-[#f0f4f8] dark:bg-background overflow-hidden rounded-xl border border-border shadow-sm">
      <FxGuruLanding />
    </div>
  )
}
