"use client"

import { useTranslations } from "next-intl"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { useSession } from "~/lib/auth-client"

type BrokerClaimDialogProps = {
  broker: any // Using any for now to avoid Prisma type import complexity
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  children?: ReactNode
}

export const BrokerClaimDialog = ({
  broker,
  isOpen,
  setIsOpen,
  children,
}: BrokerClaimDialogProps) => {
  const t = useTranslations("dialogs.claim")
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <LoginDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        description={t("intro", { domain: broker.broker_name })}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>{t("title", { toolName: broker.broker_name })}</DialogTitle>
          <DialogDescription>
            <p>{t("benefits_title")}</p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
