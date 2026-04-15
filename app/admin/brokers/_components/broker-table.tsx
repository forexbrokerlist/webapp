"use client"

import { formatDate } from "@primoui/utils"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  PlusIcon,
} from "lucide-react"
import { useQueryStates } from "nuqs"
import type { ComponentProps } from "react"
import { type Brokers, ToolStatus, PaymentStatus } from "~/.generated/prisma/browser"

export type BrokerRow = Brokers & { 
  payments?: { status: PaymentStatus }[]
  categories?: { id: string; name: string }[]
}

import { ToolActions } from "~/app/admin/brokers/_components/broker-actions"
import { ToolTableToolbarActions } from "~/app/admin/brokers/_components/broker-table-toolbar-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { brokerListParams } from "~/server/admin/brokers/schema"
import type { DataTableFilterField } from "~/types"

const statusBadges: Record<ToolStatus, ComponentProps<typeof Badge>> = {
  [ToolStatus.Draft]: {
    variant: "soft",
  },

  [ToolStatus.Pending]: {
    variant: "warning",
  },

  [ToolStatus.Scheduled]: {
    variant: "info",
  },

  [ToolStatus.Published]: {
    variant: "success",
  },
}

const paymentStatusBadges: Record<PaymentStatus, ComponentProps<typeof Badge>> = {
  [PaymentStatus.Pending]: { variant: "warning" },
  [PaymentStatus.Paid]: { variant: "success" },
  [PaymentStatus.Failed]: { variant: "danger" },
  [PaymentStatus.Cancelled]: { variant: "soft" },
}

const columns: ColumnDef<BrokerRow>[] = [
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
    accessorKey: "broker_name",
    enableHiding: false,
    size: 160,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const { id, broker_name, ownerId } = row.original

      return (
        <DataTableLink href={`/admin/brokers/${id}`} title={broker_name || ''}>
          {ownerId && <VerifiedBadge className="pointer-events-none" size="sm" />}
        </DataTableLink>
      )
    },
  },
  {
    accessorKey: "overall_rating",
    enableSorting: false,
    size: 320,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = row.getValue("overall_rating") as string
      const croppedRating = rating?.split("/")[0]?.trim()
      return <Note className="truncate">{croppedRating}</Note>
    },
  },
  {
    accessorKey: "type",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const typeLabels: Record<string, string> = {
        Broker: "Broker",
        CRM: "CRM",
        EducationPlatforms: "Education Platforms",
        ForexBridge: "Forex Bridge",
        Liquidity: "Liquidity",
        PSP: "PSP",
        Trading: "Trading",
        BotProvider: "Bot Provider",
      }
      const type = row.original.type
      if (!type) return <Note>—</Note>
      return <Badge variant="outline">{typeLabels[type] ?? type}</Badge>
    },
  },
  {
    accessorKey: "submitterEmail",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitter" />,
    cell: ({ row }) => <Note>{row.getValue("submitterEmail")}</Note>,
  },
  {
    id: "categories",
    accessorKey: "categories",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const categories = row.original.categories
      if (!categories || categories.length === 0) return <Note>—</Note>
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <Badge key={c.id} variant="soft">{c.name}</Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "paymentStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
    cell: ({ row }) => {
      const payment = row.original.payments?.[0];
      if (!payment) return <Badge variant="soft">Free</Badge>;
      
      return <Badge {...paymentStatusBadges[payment.status]}>{payment.status}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge {...statusBadges[row.original.status]}>{row.original.status}</Badge>,
  },
  
  {
    accessorKey: "publishedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
    cell: ({ row }) =>
      row.original.publishedAt ? (
        <Note>{formatDate(row.getValue<Date>("publishedAt"))}</Note>
      ) : (
        <Note>—</Note>
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ToolActions tool={row.original as any /* bypassing to fix later */} className="float-right" />,
  },
]

export function ToolTable() {
  const [params, setParams] = useQueryStates(brokerListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.brokers.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )
 
  // Search filters
  const filterFields: DataTableFilterField<BrokerRow>[] = [
    {
      id: "broker_name",
      label: "Name",
      placeholder: "Filter by name...",
    },
    {
      id: "status",
      label: "Status",
      options: [
        {
          label: "Published",
          value: ToolStatus.Published,
          icon: <CircleCheckIcon className="text-green-500" />,
        },
        {
          label: "Scheduled",
          value: ToolStatus.Scheduled,
          icon: <CircleDotIcon className="text-blue-500" />,
        },
        {
          label: "Pending",
          value: ToolStatus.Pending,
          icon: <CircleDotDashedIcon className="text-yellow-600" />,
        },
        {
          label: "Draft",
          value: ToolStatus.Draft,
          icon: <CircleDashedIcon className="text-gray-500" />,
        },
      ],
    },
  ]

  const { table } = useDataTable({
    data: data?.tools ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: (params.page || 1) - 1, pageSize: params.perPage },
      sorting: params.sort,
      columnVisibility: { submitterEmail: false, createdAt: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: originalRow => String(originalRow.id),
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Brokers"
        total={data?.total}
        callToAction={
          <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
            <Link href="/admin/brokers/new">
              <div className="max-sm:sr-only">New broker</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          isFiltered={!isDefaultState(brokerListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <ToolTableToolbarActions table={table} />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
