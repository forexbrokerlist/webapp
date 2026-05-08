"use client"

import { formatDate } from "@primoui/utils"
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
import { crmEnquiryListParams } from "~/server/admin/crm-enquiries/schema"
import type { CRMEnquiryListItem } from "~/server/admin/crm-enquiries/schema"
import type { DataTableFilterField } from "~/types"

const columns: ColumnDef<CRMEnquiryListItem>[] = [
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
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name || "—"}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <Note>{row.original.email || "—"}</Note>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <Note>{row.original.phone || "—"}</Note>,
  },
  {
    accessorKey: "message",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => <Note className="max-w-[26rem] line-clamp-2">{row.original.message || "—"}</Note>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Received At" />,
    cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CRMEnquiryActions enquiry={row.original} className="float-right" />,
  },
]

function CRMEnquiryActions({ enquiry, className }: { enquiry: CRMEnquiryListItem; className?: string }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation(
    orpc.crmEnquiries.delete.mutationOptions({
      onSuccess: () => {
        toast.success("CRM Enquiry deleted successfully")
        void queryClient.invalidateQueries({ queryKey: orpc.crmEnquiries.key() })
      },
      onError: () => {
        toast.error("Failed to delete CRM Enquiry")
      },
    }),
  )

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      mutate({ id: enquiry.id })
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

export function CRMEnquiryTable() {
  const [params, setParams] = useQueryStates({
    page: crmEnquiryListParams.page,
    perPage: crmEnquiryListParams.perPage,
    search: crmEnquiryListParams.search,
  })

  const { data, isLoading, isFetching } = useQuery(
    orpc.crmEnquiries.list.queryOptions({
      input: {
        page: params.page,
        limit: params.perPage,
        search: params.search || undefined,
      },
      placeholderData: keepPreviousData,
    }),
  )

  const filterFields: DataTableFilterField<CRMEnquiryListItem>[] = [
    {
      id: "search" as any,
      label: "Search",
      placeholder: "Filter by name, email, phone, or message...",
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
        pageSize: params.perPage,
      },
    },
    getRowId: originalRow => originalRow.id,
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader title="CRM Enquiries" total={data?.total}>
        <DataTableToolbar
          table={table}
          filterFields={[]}
          isFiltered={params.search !== ""}
          onReset={() => {
            void setParams({ search: "" })
          }}
        >
          <div className="flex items-center gap-2">
            <input
              placeholder="Search enquiries..."
              value={params.search || ""}
              onChange={e => setParams({ search: e.target.value, page: 1 })}
              className="h-8 w-[180px] lg:w-[280px] px-3 py-1 text-sm bg-background border rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
