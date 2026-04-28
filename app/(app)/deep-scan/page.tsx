import type { Metadata } from "next"
import { DeepScanChat } from "~/components/web/tools/deep-scan-chat"

export const metadata: Metadata = {
  title: "DeepScan - AI Stock Market Analysis",
  description: "Dig Deeper Into Stock Markets With Dhanarthi AI Deep Scan",
}

export default function DeepScanPage() {
  return (
    <div className="">
      <DeepScanChat />
    </div>
  )
}
