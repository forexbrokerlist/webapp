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
  const isHome = pathname === "/" || pathname === "/categories" || pathname === "/trade-snap" || pathname === "/fx-guru" || pathname === "/broker-details" || pathname.startsWith("/broker/") || pathname.startsWith("/forex-crm-providers")|| pathname=="brokers"

  return (
    <QueryProvider>
      <div
        className={cn(
          "bg-[#F0F2EC]",
          !isHome && "",
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
            {/* <Container asChild>
              <Wrapper className="grow py-fluid-md"> */}
            {/* {children}

                <Footer /> */}
            {/* </Wrapper>
            </Container> */}
            <>
              {children}
              <Footer />
            </>
          </>
        )}
      </div>
    </QueryProvider >
  )
}

