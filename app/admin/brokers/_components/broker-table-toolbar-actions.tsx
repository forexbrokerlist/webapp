"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Brokers } from "~/.generated/prisma/browser"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"
import { orpc } from "~/lib/orpc-query"

interface ToolTableToolbarActionsProps {
  table: Table<Brokers>
}

export function ToolTableToolbarActions({ table }: ToolTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <DeleteDialog
      ids={rows.map(row => String(row.original.id))}
      label="broker"
      mutationOptions={orpc.brokers.remove.mutationOptions}
      queryKey={orpc.brokers.key()}
    >
      <Button variant="normal" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </DeleteDialog>
  )
}
