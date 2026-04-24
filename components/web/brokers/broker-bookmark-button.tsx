"use client"

import { BookmarkIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState, MouseEvent } from "react"
import { toast } from "sonner"
import { Button, type ButtonProps } from "~/components/common/button"
import { Tooltip } from "~/components/common/tooltip"
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { useSession } from "~/lib/auth-client"
import { cx } from "~/lib/utils"
import { checkBrokerBookmark, setBrokerBookmark } from "~/server/web/actions/broker-bookmark"

type BrokerBookmarkButtonProps = Omit<ButtonProps, "prefix" | "onClick"> & {
  brokerId: number
  showLabel?: boolean
}

export const BrokerBookmarkButton = ({ brokerId, showLabel = false, className, size = "md", variant = "secondary", ...props }: BrokerBookmarkButtonProps) => {
  const t = useTranslations("tools.actions")
  const { data: session } = useSession()
  const router = useRouter()

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const { execute: checkBookmarkStatus } = useAction(checkBrokerBookmark, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsBookmarked(data.bookmarked)
      }
    },
  })

  const { execute: executeBookmark, isPending: isBookmarkPending } = useAction(setBrokerBookmark, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsBookmarked(data.bookmarked)

        toast.success(data.bookmarked ? t("bookmark_added") : t("bookmark_removed"), {
          action: {
            label: t("bookmark_view"),
            onClick: () => router.push("/dashboard/bookmarks"),
          },
        })
      }
    },
    onError: ({ error }) => {
      toast.error(error?.serverError || "Error updating bookmark")
    },
  })

  useEffect(() => {
    if (session?.user) {
      checkBookmarkStatus({ brokerId })
    }
  }, [session?.user, brokerId])

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation() // Prevent linking when inside BrokerCard
    
    if (!session?.user) {
      setShowLoginDialog(true)
      return
    }

    executeBookmark({ brokerId, bookmarked: !isBookmarked })
  }

  return (
    <>
      <Tooltip tooltip={isBookmarked ? t("bookmark_remove") : t("bookmark_add")}>
        <button
          className={cx(
            "bg-[#F0F1EC] w-[44px] h-[44px] flex items-center justify-center rounded-full cursor-pointer border-none transition-all hover:bg-[#e2e3dd] disabled:opacity-50",
            isBookmarked && "text-primary z-50",
            className
          )}
          onClick={handleBookmarkClick}
          disabled={isBookmarkPending}
          {...props}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"}>
            <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" stroke="#121212" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 7H20" stroke="#121212" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {showLabel ? (
            <span className="ml-2 font-medium">
              {isBookmarked ? t("bookmark_saved") : t("bookmark_save")}
            </span>
          ) : null}
        </button>
      </Tooltip>
      <LoginDialog isOpen={showLoginDialog} setIsOpen={setShowLoginDialog} />
    </>
  )
}
