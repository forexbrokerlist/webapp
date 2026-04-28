"use client"

import { useHotkeys } from "@mantine/hooks"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  GalleryHorizontalEndIcon,
  SearchIcon,
  TagIcon,
  LineChartIcon,
  TrendingUpIcon,
  TelescopeIcon,
  User,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { type ComponentProps, useEffect, useState } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { FullLogo } from "~/components/web/ui/full-logo"
import { NavLink } from "~/components/web/ui/nav-link"
import { UserMenu } from "~/components/web/user-menu"
import { adsConfig } from "~/config/ads"
import { useSearch } from "~/contexts/search-context"
import { cx } from "~/lib/utils"

const Header = ({ className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname()
  const search = useSearch()
  const t = useTranslations()
  const [isNavOpen, setNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useHotkeys([["Escape", () => setNavOpen(false)]])

  // Close the mobile navigation when the user navigates to a new page
  useEffect(() => setNavOpen(false), [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "py-3 bg-[rgba(255,255,255,0.85)] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] " : "py-5 bg-transparent",
        className
      )}
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
        <div className="flex items-center justify-between text-sm w-full">
          <Stack size="sm" wrap={false} className="min-w-0">
            <button
              type="button"
              onClick={() => setNavOpen(!isNavOpen)}
              className="block -m-1 -ml-1.5 lg:hidden"
            >
              <Hamburger className="size-7" />
            </button>

            <FullLogo className=" max-w-[175px] w-full" />
          </Stack>

          <nav className="bg-white flex items-center gap-2 rounded-full p-1.5 max-lg:hidden">
            <NavLink href="/" exact className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>
              Home
            </NavLink>
            <NavLink href="/categories" exact className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>
              Browse
            </NavLink>

            <NavLink href="/brokers" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.tools")}</NavLink>
           <DropdownMenu>
              <NavLink
                className="flex items-center gap-1 py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-[state=open]:bg-primary data-active:bg-primary transition-all duration-300"
                isPadded={false}
                asChild
              >
                <DropdownMenuTrigger>{t("navigation.ai_tools")} <ChevronDownIcon className="size-4 opacity-75 group-data-[state=open]:-rotate-180 transition-transform" /></DropdownMenuTrigger>
              </NavLink>

              <DropdownMenuContent align="start">
                {/* <DropdownMenuItem asChild> */}
                {/* <NavLink href="/fx-guru" prefix={<LineChartIcon />}>
                    {t("navigation.fx_guru")}
                  </NavLink> */}
                {/* </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <NavLink href="/trade-snap" prefix={<TrendingUpIcon />}>
                    {t("navigation.trade_snap")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/fx-guru" prefix={<TrendingUpIcon />}>
                    {t("navigation.fx_guru")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/deep-scan" prefix={<TelescopeIcon />}>
                    {t("navigation.deep_research")}
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavLink href="/about" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.about")}</NavLink>
            <NavLink href="/contact" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.contact_us")}</NavLink>
            {adsConfig.enabled && <NavLink href="/advertise" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.advertise")}</NavLink>}
          </nav>

          <Stack size="sm" wrap={false} className="justify-end gap-3 max-lg:grow">
            {/* <Button size="sm" variant="ghost" className="p-1 text-base" onClick={search.open}>
              <SearchIcon />
            </Button> */}



            {/* <Button size="md" variant="primary" className="px-7" asChild>
              <Link href="/submit">{t("navigation.submit")}</Link>
            </Button> */}
            <div className='w-[50px] h-[50px] border cursor-pointer bg-white border-solid border-border-light800 transition-all duration-300 hover:border-primary flex items-center justify-center rounded-full'>
              <User className='text-black100 w-6 h-6' />
            </div>
            <UserMenu />
          </Stack>
        </div>

        <nav
          className={cx(
            "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
            isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <NavLink href="/?sort=publishedAt.desc">{t("navigation.latest_tools")}</NavLink>
          <NavLink href="/categories">{t("navigation.categories")}</NavLink>
          <NavLink href="/tags">{t("navigation.tags")}</NavLink>
          <NavLink href="/fx-guru">{t("navigation.fx_guru")}</NavLink>
          <NavLink href="/trade-snap">{t("navigation.trade_snap")}</NavLink>

          {/* <NavLink href="/stock-guru">{t("navigation.stock_guru")}</NavLink> */}
          <NavLink href="/deep-scan">{t("navigation.deep_research")}</NavLink>
          <NavLink href="/submit">{t("navigation.submit")}</NavLink>
          <NavLink href="/brokers">{t("navigation.tools")}</NavLink>
          <NavLink href="/about">{t("navigation.about")}</NavLink>
          <NavLink href="/contact">{t("navigation.contact_us")}</NavLink>
          {adsConfig.enabled && <NavLink href="/advertise">{t("navigation.advertise")}</NavLink>}
        </nav>
      </div>
    </header>
  )
}

export { Header }
