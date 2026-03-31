import { getInitials } from "@primoui/utils"
import { BookmarkIcon, LogOutIcon, ShieldHalfIcon, TrendingUpIcon, UserIcon } from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar"
import { Box } from "~/components/common/box"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { NavLink } from "~/components/web/ui/nav-link"
import { UserLogout } from "~/components/web/user-logout"
import { useSession } from "~/lib/auth-client"

export const UserMenu = () => {
  const { data: session, isPending } = useSession()
  const t = useTranslations()

  if (isPending) {
    return (
      <Button size="sm" variant="secondary" disabled>
        {t("navigation.sign_in")}
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Button size="sm" variant="secondary" asChild>
          <Link href="/auth/login">{t("navigation.sign_in")}</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex size-6 shrink-0 items-center justify-center rounded-md outline-none">
            <Avatar className="size-full transition duration-100 group-hover:ring-2 group-hover:ring-border group-focus-visible:ring-2 group-focus-visible:ring-border">
              {session.user.image && <AvatarImage src={session.user.image} />}
              <AvatarFallback className="text-[10px]">{getInitials(session.user.name)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuLabel className="max-w-48 truncate font-normal leading-relaxed">
            {session.user.name}

            {session.user.name !== session.user.email && (
              <div className="text-muted-foreground truncate">{session.user.email}</div>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {session.user.role === "admin" && (
            <DropdownMenuItem asChild>
              <NavLink href="/admin" prefix={<ShieldHalfIcon />}>
                {t("navigation.admin_panel")}
              </NavLink>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <NavLink href="/dashboard" prefix={<UserIcon />}>
              {t("navigation.dashboard")}
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <NavLink href="/advertiser/dashboard" prefix={<TrendingUpIcon />}>
              Advertiser Dashboard
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <NavLink href="/dashboard/bookmarks" prefix={<BookmarkIcon />}>
              {t("navigation.bookmarks")}
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <NavLink prefix={<LogOutIcon />} asChild>
              <UserLogout>{t("navigation.sign_out")}</UserLogout>
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
