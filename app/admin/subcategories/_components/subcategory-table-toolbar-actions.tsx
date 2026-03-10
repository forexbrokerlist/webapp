"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Subcategory } from "~/.generated/prisma/browser"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"
import { orpc } from "~/lib/orpc-query"

interface SubcategoryTableToolbarActionsProps {
  table: Table<Subcategory>
}

export function SubcategoryTableToolbarActions({ table }: SubcategoryTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <DeleteDialog
      ids={rows.map(row => row.original.id)}
      label="subcategory"
      mutationOptions={orpc.subcategories.remove.mutationOptions}
      queryKey={orpc.subcategories.key()}
    >
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </DeleteDialog>
  )
}
