"use client"

import { isValidUrl } from "@primoui/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CopyIcon, EllipsisIcon, GlobeIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Sponsor } from "~/.generated/prisma/browser"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"
import { ButtonGroup } from "~/components/common/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { ExternalLink } from "~/components/web/external-link"
import { orpc } from "~/lib/orpc-query"
import { cx } from "~/lib/utils"

type SponsorActionsProps = ComponentProps<typeof Button> & {
  sponsor: Sponsor
}

export const SponsorActions = ({ sponsor, className, ...props }: SponsorActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const indexPath = "/admin/sponsors"
  const singlePath = `${indexPath}/${sponsor.id}`
  const isSinglePage = pathname === singlePath

  const duplicateMutation = useMutation(
    orpc.sponsors.duplicate.mutationOptions({
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: orpc.sponsors.key() })

        if (isSinglePage) {
          router.push(`${indexPath}/${data.id}`)
        }
      },
    }),
  )

  const handleDuplicate = () => {
    toast.promise(duplicateMutation.mutateAsync({ id: sponsor.id }), {
      loading: "Duplicating sponsor...",
      success: "Sponsor duplicated successfully",
      error: err => `Failed to duplicate sponsor: ${err.message}`,
    })
  }

  return (
    <ButtonGroup>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="secondary"
            size="sm"
            prefix={<EllipsisIcon />}
            className={cx("data-[state=open]:bg-accent", className)}
            {...props}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8}>
          {!isSinglePage && (
            <DropdownMenuItem asChild>
              <Link href={singlePath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleDuplicate}>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>

          {isValidUrl(sponsor.websiteUrl ?? "") && (
            <DropdownMenuItem asChild>
              <ExternalLink href={sponsor.websiteUrl!} doTrack>
                <GlobeIcon />
                Visit website
              </ExternalLink>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        ids={[sponsor.id]}
        label="sponsor"
        mutationOptions={orpc.sponsors.remove.mutationOptions}
        queryKey={orpc.sponsors.key()}
        onExecute={() => isSinglePage && router.push(indexPath)}
      >
        <Button
          aria-label="Delete"
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </DeleteDialog>
    </ButtonGroup>
  )
}
