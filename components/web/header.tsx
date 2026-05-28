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
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
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
    <>
      <header
        className={cx(
          "fixed top-0 left-0 w-full z-[999] transition-all duration-300",
          isScrolled ? "py-3 bg-[rgba(255,255,255,0.85)] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] " : "py-5 max-mobile:py-3 bg-transparent",
          className
        )}
        data-state={isNavOpen ? "open" : "close"}
        {...props}
      >
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="flex items-center justify-between text-sm w-full">
            <Stack size="sm" wrap={false} className="min-w-0">


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
              {/* <NavLink href="/about" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.about")}</NavLink> */}
              <NavLink href="/forex-crm" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.forex_crm")}</NavLink>
              {adsConfig.enabled && <NavLink href="/advertise" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.advertise")}</NavLink>}

              <NavLink href="/contact" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.contact_us")}</NavLink>
              <NavLink href="/news" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>{t("navigation.news")}</NavLink>
              <NavLink href="/expo" className="block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary data-active:bg-primary transition-all duration-300" isPadded={false}>Expo</NavLink>
              
            </nav>

            <Stack size="sm" wrap={false} className="justify-end gap-3 max-lg:grow">
              <div className='w-[50px] h-[50px] border cursor-pointer hidden bg-white border-solid border-border-light800 transition-all duration-300 hover:border-primary  items-center justify-center rounded-full'>
                <User className='text-black100 w-6 h-6' />
              </div>
              <UserMenu />
            </Stack>
            <button
              type="button"
              className="hidden pl-2 max-mobile:block"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
            >
              <Hamburger className="size-7 text-black100" />
            </button>
          </div>


        </div>
      </header>
      <AnimatePresence>
        {isNavOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
              onClick={() => setNavOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <motion.div
              key="mobile-nav-panel"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 left-0 w-full h-dvh bg-white z-[99999] flex flex-col"
            >
              {/* Header bar */}
              <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-solid border-border-light300 shrink-0">
                <FullLogo className="max-w-[175px] w-full" />
                <motion.button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setNavOpen(false)}
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-black100" />
                </motion.button>
              </div>

              {/* Nav links */}
              <div className="py-8 px-4 h-[calc(100dvh-57px)] overflow-auto">
                <nav className="text-lg font-medium text-black100 grid grid-cols-1 gap-5" onClick={() => setNavOpen(false)}>
                  {[
                    { href: "/?sort=publishedAt.desc", label: t("navigation.latest_tools") },
                    { href: "/categories", label: t("navigation.categories") },
                    { href: "/tags", label: t("navigation.tags") },
                    { href: "/fx-guru", label: t("navigation.fx_guru") },
                    { href: "/trade-snap", label: t("navigation.trade_snap") },
                    { href: "/deep-scan", label: t("navigation.deep_research") },
                    { href: "/submit", label: t("navigation.submit") },
                    { href: "/brokers", label: t("navigation.tools") },
                    { href: "/about", label: t("navigation.about") },
                    { href: "/contact", label: t("navigation.contact_us") },
                    { href: "/forex-crm", label: t("navigation.forex_crm") },
                    { href: "/news", label: t("navigation.news") },
                    {href:"/expo",label:"Expo"},

                    ...(adsConfig.enabled ? [{ href: "/advertise", label: t("navigation.advertise") }] : []),
                  ].map(({ href, label }, i) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.04,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <NavLink href={href}>{label}</NavLink>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export { Header }
