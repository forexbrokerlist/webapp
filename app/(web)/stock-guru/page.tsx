import type { Metadata } from "next"
import { StockGuruChat } from "~/components/web/tools/stock-guru-chat"

export const metadata: Metadata = {
  title: "StockGuru - AI Market Assistant",
  description: "Get actionable insights from stock charts and market analysis",
}

export default function StockGuruPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px-var(--header-height))] bg-[#f0f4f8] dark:bg-background">
      <StockGuruChat />
    </div>
  )
}
