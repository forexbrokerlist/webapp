"use client"

import { formatDate, tryCatch } from "@primoui/utils"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Trash2Icon } from "lucide-react"
import { useQueryStates } from "nuqs"
import { toast } from "sonner"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Button } from "~/components/common/button"
import { Note } from "~/components/common/note"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { newsletterListParams } from "~/server/admin/newsletter/schema"
import type { Newsletter } from "~/server/admin/newsletter/schema"
import type { DataTableFilterField } from "~/types"

const columns: ColumnDef<Newsletter>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <RowCheckbox
        checked={table.getIsAllPageRowsSelected()}
        ref={input => {
          if (input) {
            input.indeterminate =
              table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
        }}
        onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => (
      <RowCheckbox
        checked={row.getIsSelected()}
        onChange={e => row.toggleSelected(e.target.checked)}
        aria-label="Select row"
        table={table}
        row={row}
      />
    ),
  },
  {
    accessorKey: "email",
    enableHiding: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
    cell: ({ row }) => <Note>{row.original.firstName || "—"}</Note>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
    cell: ({ row }) => <Note>{row.original.lastName || "—"}</Note>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subscribed At" />,
    cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
  },
  {
    id: "actions",
    cell: ({ row }) => <NewsletterActions newsletter={row.original} className="float-right" />,
  },
]

function NewsletterActions({ newsletter, className }: { newsletter: Newsletter; className?: string }) {
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useMutation(
    orpc.newsletter.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Subscriber deleted successfully")
        void queryClient.invalidateQueries({ queryKey: orpc.newsletter.key() })
      },
      onError: () => {
        toast.error("Failed to delete subscriber")
      },
    }),
  )

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      mutate({ id: newsletter.id })
    }
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        isPending={isPending}
        onClick={handleDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  )
}

export function NewsletterTable() {
  const [params, setParams] = useQueryStates({
    page: newsletterListParams.page,
    perPage: newsletterListParams.perPage,
    search: newsletterListParams.search,
  })

  const { data, isLoading, isFetching } = useQuery(
    orpc.newsletter.list.queryOptions({
      input: {
        page: params.page,
        limit: params.perPage,
        search: params.search || undefined,
      },
      placeholderData: keepPreviousData,
    }),
  )

  const filterFields: DataTableFilterField<Newsletter>[] = [
    {
      id: "search" as any,
      label: "Search",
      placeholder: "Filter by email or name...",
    },
  ]

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    clearOnDefault: true,
    initialState: {
      pagination: { 
        pageIndex: (params.page || 1) - 1, 
        pageSize: params.perPage 
      },
    },
    getRowId: originalRow => originalRow.id,
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Newsletter Subscribers"
        total={data?.total}
      >
        <DataTableToolbar
          table={table}
          filterFields={[]} // Custom search is handled via nuqs search param usually, but let's see how DataTable handles it
          isFiltered={params.search !== ""}
          onReset={() => {
            void setParams({ search: "" })
          }}
        >
          <div className="flex items-center gap-2">
            <input
              placeholder="Search subscribers..."
              value={params.search || ""}
              onChange={(e) => setParams({ search: e.target.value, page: 1 })}
              className="h-8 w-[150px] lg:w-[250px] px-3 py-1 text-sm bg-background border rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
