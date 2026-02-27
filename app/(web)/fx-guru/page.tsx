import type { Metadata } from "next"
import { FxGuruChat } from "~/components/web/tools/fx-guru-chat"

export const metadata: Metadata = {
  title: "FxGURU - AI Forex Assistant",
  description: "Get market intelligence with the FxGURU AI Assistant",
}

export default function FxGuruPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px-var(--header-height))] bg-[#f0f4f8] dark:bg-background">
      <FxGuruChat />
    </div>
  )
}
