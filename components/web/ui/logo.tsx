"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { LogoSymbol as DarkLogo } from "~/components/web/ui/dark-logo-symbol"
import { LogoSymbol as LightLogo } from "~/components/web/ui/logo-symbol"
import { siteConfig } from "~/config/site"
import { cx } from "~/lib/utils"

export const Logo = ({
  className,
  symbolClassName = "size-5",
  hideText = false,
  ...props
}: ComponentProps<typeof Stack> & {
  symbolClassName?: string
  hideText?: boolean
}) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const LogoSymbol = resolvedTheme === "light" ? DarkLogo : LightLogo

  return (
    <Stack size="sm" className={cx("group/logo", className)} wrap={false} asChild {...props}>
      <Link href="/">
        {mounted ? (
          <LogoSymbol className={symbolClassName} />
        ) : (
          <div className={symbolClassName} />
        )}
        {!hideText && <span className="font-medium text-sm truncate">{siteConfig.name}</span>}
      </Link>
    </Stack>
  )
}
