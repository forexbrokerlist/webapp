import type { Metadata } from "next"
import { DeepScanChat } from "~/components/web/tools/deep-scan-chat"

export const metadata: Metadata = {
  title: "DeepScan - AI Stock Market Analysis",
  description: "Dig Deeper Into Stock Markets With Dhanarthi AI Deep Scan",
}

export default function DeepScanPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px-var(--header-height))] bg-background">
      <DeepScanChat />
    </div>
  )
}
