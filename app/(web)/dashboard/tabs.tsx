"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"

export const DashboardTabs = () => {
  const t = useTranslations("pages.dashboard.tabs")
  const pathname = usePathname()

  const tabs = [
    {
      href: "/dashboard",
      label: t("tools"),
    },
    {
      href: "/dashboard/bookmarks",
      label: t("bookmarks"),
    },
  ]

  return (
    <Stack size="sm">
      {tabs.map(tab => (
        <Button
          key={tab.href}
          size="md"
          variant={pathname === tab.href ? "primary" : "secondary"}
          asChild
        >
          <Link href={tab.href}>{tab.label}</Link>
        </Button>
      ))}
    </Stack>
  )
}
