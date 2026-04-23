import { type PropsWithChildren, Suspense } from "react"
import { redirect } from "next/navigation"
import { Wrapper } from "~/components/common/wrapper"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Header } from "~/components/web/header"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Container } from "~/components/web/ui/container"
import { QueryProvider } from "~/components/admin/providers/query-provider"
import { getServerSession } from "~/lib/auth"

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await getServerSession()

  return (
    <QueryProvider>
      <div className="bg-[#F0F2EC]">
        <Header />
        {children}
      </div>
    </QueryProvider >
  )
}
