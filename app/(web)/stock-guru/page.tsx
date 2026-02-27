import type { Metadata } from "next"
import { StockGuruChat } from "~/components/web/tools/stock-guru-chat"

export const metadata: Metadata = {
  title: "Stock Guru",
  description: "Your AI Stock Guru Assistant",
}

export default function StockGuruPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px-var(--header-height))] bg-[#f0f4f8] dark:bg-background">
      <StockGuruChat />
    </div>
  )
}
