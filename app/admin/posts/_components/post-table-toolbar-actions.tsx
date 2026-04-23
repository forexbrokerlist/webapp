"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Post } from "~/.generated/prisma/browser"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"
import { orpc } from "~/lib/orpc-query"

interface PostTableToolbarActionsProps {
  table: Table<Post>
}

export function PostTableToolbarActions({ table }: PostTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <DeleteDialog
      ids={rows.map(row => row.original.id)}
      label="post"
      mutationOptions={orpc.posts.remove.mutationOptions}
      queryKey={orpc.posts.key()}
    >
      <Button variant="normal" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </DeleteDialog>
  )
}
