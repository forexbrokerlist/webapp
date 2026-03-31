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
  
  if (!session) {
    // If not logged in, redirect to login page with callback to current path
    redirect("/auth/login")
  }

  return (
    <QueryProvider>
      <div className="flex flex-col min-h-dvh overflow-clip pt-(--header-inner-offset)">
        <Header />

        <Backdrop isFixed />

        <Suspense>
          <AdBanner />
        </Suspense>

        <Container asChild>
          <Wrapper className="grow flex flex-col">
            {children}
          </Wrapper>
        </Container>
      </div>
    </QueryProvider>
  )
}
