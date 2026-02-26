"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Sponsor } from "~/.generated/prisma/browser"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"
import { orpc } from "~/lib/orpc-query"

interface SponsorTableToolbarActionsProps {
  table: Table<Sponsor>
}

export function SponsorTableToolbarActions({ table }: SponsorTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <DeleteDialog
      ids={rows.map(row => row.original.id)}
      label="sponsor"
      mutationOptions={orpc.sponsors.remove.mutationOptions}
      queryKey={orpc.sponsors.key()}
    >
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </DeleteDialog>
  )
}
