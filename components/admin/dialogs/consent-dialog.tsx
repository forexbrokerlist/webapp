"use client"

import { getHotkeyHandler } from "@mantine/hooks"
import { type ComponentProps, type ReactNode } from "react"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog"
import { Kbd } from "~/components/common/kbd"

type ConsentDialogProps = ComponentProps<typeof Dialog> & {
  title: string
  description: ReactNode
  confirmLabel?: string
  onConfirm: () => void
}

export const ConsentDialog = ({
  children,
  title,
  description,
  confirmLabel = "Ok, I understand",
  onConfirm,
  ...props
}: ConsentDialogProps) => {
  const handleKeyDown = getHotkeyHandler([
    [
      "mod+Enter",
      e => {
        e.stopPropagation()
        onConfirm()
      },
    ],
  ])

  return (
    <Dialog {...props}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-w-sm" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="md" variant="secondary" suffix={<Kbd keys={["esc"]} />}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="md"
            onClick={onConfirm}
            suffix={<Kbd variant="outline" keys={["meta", "enter"]} />}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
