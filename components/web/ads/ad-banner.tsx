"use client"

import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { AdBadge, AdLink } from "~/components/web/ads/ad-base"
import { Container } from "~/components/web/ui/container"
import { Favicon } from "~/components/web/ui/favicon"
import { cx } from "~/lib/utils"
import { findAdWithFallback, trackAdImpression } from "~/server/web/ads/actions"
import type { AdOne } from "~/server/web/ads/payloads"
import { siteConfig } from "~/config/site"

export const AdBanner = ({ className, ...props }: ComponentProps<typeof Card>) => {
  const [ad, setAd] = useState<AdOne | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAd = async () => {
      try {
        const type = "Banner"
        const { data: adData } = await findAdWithFallback({ type })
        setAd(adData ?? null)
        
        // Track impression when ad is loaded (only for real ads, not fallback)
        if (adData && adData.id !== siteConfig.slug && adData.status !== "Draft") {
          await trackAdImpression({ adId: adData.id })
        }
      } catch (error) {
        console.error("Failed to load ad:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAd()
  }, [])

  if (isLoading || !ad) {
    return null
  }

  return (
    <Container className="z-49 mt-1">
      <Card
        className={cx("flex-row items-center gap-3 px-3 py-2.5 md:px-4", className)}
        asChild
        {...props}
      >
        <AdLink ad={ad} type="Banner" source="banner">
          <AdBadge className="leading-none max-sm:order-last" />

          <div className="text-xs leading-tight text-secondary-foreground mr-auto sm:text-sm">
            <Favicon
              src={ad.faviconUrl}
              title={ad.name}
              size={32}
              className="float-left align-middle p-0 mr-1.5 size-3.5 rounded-sm sm:size-4"
            />
            <strong className="font-medium text-foreground">{ad.name}</strong> — {ad.description}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 leading-none pointer-events-none max-sm:hidden"
            asChild
          >
            <span>{ad.buttonLabel || "Learn more"}</span>
          </Button>
        </AdLink>
      </Card>
    </Container>
  )
}
