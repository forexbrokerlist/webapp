"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Link } from "~/components/common/link"
import { cx } from "~/lib/utils"

interface FullLogoProps {
  className?: string
}

export const FullLogo = ({ className }: FullLogoProps) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cx("h-8 w-[104px] bg-muted/20 animate-pulse rounded", className)} />
  }

  const logoSrc = "/full-logo-dark.svg"

  return (
    <Link href="/" className={cx("block shrink-0", className)}>
      <Image
        src={logoSrc}
        alt="Forex Brokerslist"
        width={286}
        height={88}
        className="h-8 w-auto object-contain"
        priority
      />
    </Link>
  )
}
