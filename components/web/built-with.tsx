"use client"

import { setQueryParams } from "@primoui/utils"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"
import { cx } from "~/lib/utils"
import { Logo } from "./ui/logo"

type BuiltWithProps = ComponentProps<typeof Stack> & {
  medium?: string
}

export const BuiltWith = ({ className, medium, ...props }: BuiltWithProps) => {
  const t = useTranslations()
  const rssSearchParams = { utm_source: siteConfig.domain, utm_medium: medium ?? "" }
  const href = setQueryParams(linksConfig.builtWith, rssSearchParams)

  return (
    <Stack
      size="sm"
      wrap={false}
      className={cx("text-sm text-muted-foreground hover:text-secondary-foreground", className)}
      asChild
      {...props}
    >
      <ExternalLink href={href} doTrack doFollow>
        {t("common.built_with")}
        <Stack wrap={false} className="gap-[0.35em] font-medium text-foreground" asChild>
          <Logo className="size-5" />
        </Stack>
      </ExternalLink>
    </Stack>
  )
}
