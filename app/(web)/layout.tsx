"use client"

// import PlausibleProvider from "next-plausible"
import { usePathname } from "next/navigation"
import { type PropsWithChildren, Suspense } from "react"
import { Wrapper } from "~/components/common/wrapper"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Container } from "~/components/web/ui/container"
// import { env } from "~/env"

import { QueryProvider } from "~/components/admin/providers/query-provider"
import Navbar from "~/components/web/navbar"
import { cn } from "~/lib/utils"

export default function ({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname === "/categories" || pathname === "/trade-snap" || pathname === "/fx-guru" || pathname === "/broker-details"

  return (
    <QueryProvider>
      <div
        className={cn(
          "bg-[#F0F2EC]",
          !isHome && "flex flex-col min-h-dvh overflow-clip pt-(--header-inner-offset)",
        )}
      >
        <Header />
        {isHome ? (
          <>
            {children}
            <Footer />
          </>
        ) : (
          <>
            <Container asChild>
              <Wrapper className="grow py-fluid-md">
                {children}

                <Footer />
              </Wrapper>
            </Container>
          </>
        )}
      </div>
    </QueryProvider >
  )
}

