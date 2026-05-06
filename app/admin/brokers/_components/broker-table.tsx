"use client"
React
import { formatDate } from "@primoui/utils"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  GripVerticalIcon,
  PlusIcon,
} from "lucide-react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { DraggableTableRow } from "./draggable-table-row"
import { useQueryStates } from "nuqs"
import type { ComponentProps } from "react"
import { type Brokers, ToolStatus, PaymentStatus } from "~/.generated/prisma/browser"
import { useMemo, useState, useEffect, useRef } from "react"

export type BrokerRow = Brokers & {
  payments?: { status: PaymentStatus }[]
  categories?: { id: string; name: string }[]
  type?: { id: string; name: string } | null
}

import { ToolActions } from "~/app/admin/brokers/_components/broker-actions"
import { ToolTableToolbarActions } from "~/app/admin/brokers/_components/broker-table-toolbar-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { TableBody, TableCell, TableRow } from "~/components/common/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
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
import React from "react"

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
    id: "drag-handle",
    size: 40,
    enableHiding: false,
    header: "",
    cell: () => <GripVerticalIcon className="size-4 text-muted-foreground" />,
  },
  {
    accessorKey: "broker_name",
    enableHiding: false,
    size: 160,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const { id, broker_name, ownerId } = row.original

      return (
        <DataTableLink href={`/admin/brokers/${id}`} title={broker_name || ''} isOverlay={false}>
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
      const type = row.original.type?.name
      if (!type) return <Note>—</Note>
      return <Badge variant="outline">{type}</Badge>
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
    accessorKey: "isSponsor",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sponsor" />,
    cell: ({ row }) =>
      row.original.isSponsor ? (
        <Badge variant="success">Yes</Badge>
      ) : (
        <Note>—</Note>
      ),
  },
  {
    accessorKey: "isPremiumBroker",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Premium" />,
    cell: ({ row }) =>
      row.original.isPremiumBroker ? (
        <Badge variant="warning">Yes</Badge>
      ) : (
        <Note>—</Note>
      ),
  },
  {
    accessorKey: "isMainSponsor",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Main Sponsor" />,
    cell: ({ row }) =>
      row.original.isMainSponsor ? (
        <Badge variant="info">Yes</Badge>
      ) : (
        <Note>—</Note>
      ),
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [items, setItems] = useState<BrokerRow[]>([])
  const [isReordering, setIsReordering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { data: types = [] } = useQuery(orpc.types.lookup.queryOptions())
  const queryClient = useQueryClient()

  // Set mounted on client load
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data, isLoading, isFetching } = useQuery(
    orpc.brokers.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )
  const isInitialLoad = isLoading && !data;
  const storageKey = `pending-broker-order-page-${params.page}`

  const hasResumedSync = useRef(false)

  // Sync local items with server data, prioritizing localStorage for "reload-proof" experience
  useEffect(() => {
    if (data?.tools) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const pendingIds = JSON.parse(stored) as number[]
          console.log("Restoring pending order from local storage", pendingIds)
          const reordered = pendingIds
            .map(id => data.tools.find(t => t.id === id))
            .filter(Boolean) as BrokerRow[]

          if (reordered.length === data.tools.length) {
            setItems(reordered)

            const isSyncedWithBackend = data.tools.every((t, i) => t.id === pendingIds[i])
            if (isSyncedWithBackend) {
              localStorage.removeItem(storageKey)
            } else if (!hasResumedSync.current && !isReordering) {
              hasResumedSync.current = true
              const startIndex = ((params.page || 1) - 1) * params.perPage
              setTimeout(() => {
                reorderMutation.mutate({
                  ids: pendingIds,
                })
              }, 50)
            }
            return
          }
        } catch (e) {
          localStorage.removeItem(storageKey)
        }
      }
      setItems(data.tools)
    }
  }, [data?.tools, storageKey])

  const reorderMutation = useMutation(
    orpc.brokers.reorder.mutationOptions({
      onMutate: () => {
        setIsReordering(true)
      },
      onError: (err) => {
        setIsReordering(false)
        localStorage.removeItem(storageKey)
        console.error("Reorder Mutation Failed", err)
        if (data?.tools) {
          setItems(data.tools)
        }
      },
      onSettled: async () => {
        localStorage.removeItem(storageKey)
        await queryClient.invalidateQueries({ queryKey: orpc.brokers.list.key() })
        setIsReordering(false)
      },
    }),
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    console.log("Drag Ended", { activeId: active.id, overId: over?.id })

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => String(item.id) === active.id)
      const newIndex = items.findIndex(item => String(item.id) === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex)

        const startIndex = ((params.page || 1) - 1) * params.perPage
        console.log("REORDER START", { idsCount: newItems.length, startIndex })

        // Update local state IMMEDIATELY (Frontend First)
        setItems(newItems)

        // Persistence: Save to local storage so we stay reordered if we refresh mid-save
        localStorage.setItem(storageKey, JSON.stringify(newItems.map(i => i.id)))

        // Sync with backend later
        reorderMutation.mutate({
          ids: newItems.map(item => item.id),
        })
      }
    }
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    console.log("Drag Started", { activeId: event.active.id })
  }

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
    {
      id: "beginner_friendly",
      label: "Beginner Friendly",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  ]

  const { table } = useDataTable({
    data: items,
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

  const hasPendingStorage = isMounted && typeof window !== 'undefined' && !!localStorage.getItem(storageKey)
  const showReorderOverlay = isReordering || hasPendingStorage

  if (!isMounted || isInitialLoad) {
    return (
      <div className="relative space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-[400px] w-full bg-muted/50 animate-pulse rounded-md" />
        {showReorderOverlay && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
            <div className="animate-pulse text-sm">Updating order...</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => String(item.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="relative">
          <DataTable
            table={table}
            isLoading={isLoading}
            isFetching={isFetching && !isLoading && !showReorderOverlay}
            renderRow={props => <DraggableTableRow {...props} />}
          >
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

                <Select
                  value={params.type || "all"}
                  onValueChange={val => setParams({ type: val === "all" ? null : val })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(t => (
                      <SelectItem key={t.id} value={t.name.toLowerCase().replace(/\s+/g, "-")}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DateRangePicker align="end" />
                <DataTableViewOptions table={table} />
              </DataTableToolbar>
            </DataTableHeader>
          </DataTable>
          {showReorderOverlay && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
              <div className="animate-pulse text-sm">Updating order...</div>
            </div>
          )}
        </div>
      </SortableContext>
      {typeof window !== "undefined" && (
        <DragOverlay adjustScale={false}>
          {activeId ? (
            <div className="bg-background border rounded shadow-lg flex items-center h-10 px-4 opacity-80 cursor-grabbing">
              <GripVerticalIcon className="size-4 text-muted-foreground mr-4" />
              <span className="font-medium">
                {items.find(t => String(t.id) === activeId)?.broker_name ?? "Moving..."}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      )}
    </DndContext>
  )
}
