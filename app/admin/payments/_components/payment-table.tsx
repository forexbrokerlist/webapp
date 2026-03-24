"use client"

import { formatDate, formatCurrency } from "@primoui/utils"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useQueryStates } from "nuqs"
import type { ComponentProps } from "react"
import { type Payment, PaymentStatus } from "~/.generated/prisma/browser"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { paymentListParams } from "~/server/admin/payments/schema"
import type { DataTableFilterField } from "~/types"

const statusBadges = {
  Pending: { variant: "warning" as const },
  Paid: { variant: "success" as const },
  Failed: { variant: "danger" as const },
  Cancelled: { variant: "soft" as const },
}

// Payment relation type to ensure types flow correctly for nested fields
type PaymentRow = Payment & {
  user?: { email: string; name: string | null } | null
  plan?: { name: string } | null
}

const columns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "user.email",
    enableHiding: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const email = row.original.user?.email || "Unknown"
      const name = row.original.user?.name
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name || email}</span>
          {name && <Note className="text-xs">{email}</Note>}
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => (
      <div className="font-medium">{formatCurrency(row.original.amount, row.original.currency)}</div>
    ),
  },
  {
    accessorKey: "plan.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
    cell: ({ row }) => {
      const planName = row.original.plan?.name
      const type = (row.original.metadata as any)?.type === "ad" ? "Ad Purchase" : "Subscription"
      
      return (
        <div className="flex flex-col">
          <span>{planName || "Custom"}</span>
          <Note className="text-xs">{type}</Note>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusBadges
      const badgeProps = statusBadges[status] || { variant: "default" }
      return <Badge {...badgeProps}>{status}</Badge>
    },
  },
  {
    accessorKey: "gateway",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gateway" />,
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.gateway}</Badge>,
  },
  {
    accessorKey: "orderId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
    cell: ({ row }) => <Note className="font-mono text-xs max-w-40 truncate" title={row.original.orderId || ""}>{row.original.orderId || "-"}</Note>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"), "medium")}</Note>,
  },
]

export function PaymentTable() {
  const [params, setParams] = useQueryStates(paymentListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.payments.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )

  // Search filters
  const filterFields: DataTableFilterField<any>[] = [
    {
      id: "email",
      label: "Customer Email",
      placeholder: "Filter by email...",
    },
    {
      id: "status",
      label: "Status",
      options: Object.values(PaymentStatus).map(type => ({
        label: type,
        value: type,
      })),
    },
    {
      id: "gateway",
      label: "Gateway",
      placeholder: "Filter by gateway...",
    },
  ]

  const { table } = useDataTable({
    data: data?.payments ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields: filterFields as unknown as DataTableFilterField<PaymentRow>[],
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: params.perPage },
      sorting: params.sort,
      columnVisibility: { orderId: false },
    },
    getRowId: originalRow => originalRow.id,
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Payments"
        total={data?.paymentsTotal}
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields as unknown as DataTableFilterField<PaymentRow>[]}
          isFiltered={!isDefaultState(paymentListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
