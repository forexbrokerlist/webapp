"use client"

import { DownloadIcon, Loader2Icon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "~/components/common/button"
import { orpc } from "~/lib/orpc-query"
import type { Table } from "@tanstack/react-table"
import type { Type } from "~/.generated/prisma/browser"

interface TypeTableToolbarActionsProps {
  table: Table<Type>
}

export function TypeTableToolbarActions({ table }: TypeTableToolbarActionsProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    orpc.types.remove.mutationOptions({
      onSuccess: () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        toast.success(`${selectedRows.length} types deleted successfully`)
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: orpc.types.key() })
      },
      onError: () => {
        toast.error("Failed to delete types")
      },
    }),
  )

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) return

    deleteMutation.mutate({
      ids: selectedRows.map(row => row.original.id)
    })
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <>
      {selectedRows.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2Icon className="mr-2 h-4 w-4" />
          )}
          Delete ({selectedRows.length})
        </Button>
      )}
    </>
  )
}
