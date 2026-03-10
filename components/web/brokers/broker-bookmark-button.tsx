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
        <Button
          size={size}
          variant={variant}
          prefix={<BookmarkIcon className={cx(isBookmarked && "fill-current")} />}
          className={cx(isBookmarked && "text-primary z-50", className)}
          onClick={handleBookmarkClick}
          isPending={isBookmarkPending}
          {...props}
        >
          {showLabel ? (isBookmarked ? t("bookmark_saved") : t("bookmark_save")) : null}
        </Button>
      </Tooltip>
      <LoginDialog isOpen={showLoginDialog} setIsOpen={setShowLoginDialog} />
    </>
  )
}
