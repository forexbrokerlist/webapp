"use client"

import { formatDate } from "@primoui/utils"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { CalendarIcon, PlusIcon, UserIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import type { Post } from "~/.generated/prisma/browser"
import { PostActions } from "./post-actions"
import { PostTableToolbarActions } from "./post-table-toolbar-actions"
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
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { postListParams } from "~/server/admin/posts/schema"
import type { DataTableFilterField } from "~/types"

const columns: ColumnDef<Post & { author?: { name: string; image?: string | null } }>[] = [
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
    accessorKey: "title",
    enableHiding: false,
    size: 240,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <DataTableLink href={`/admin/posts/${row.original.id}`} title={row.original.title} />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === "Published" ? "success" : status === "Draft" ? "outline" : "warning"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "author.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => (
      <Note className="max-w-40 truncate flex items-center gap-1.5 ">
        <UserIcon className="size-3!" />
        {row.original.author?.name || "Unknown"}
      </Note>
    ),
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
    cell: ({ row }) => (
      <Note className="flex items-center gap-1.5">
        <CalendarIcon className="size-3!" />
        {formatDate(row.getValue<Date>("publishedAt"))}
      </Note>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PostActions post={row.original} className="float-right" />,
  },
]

export function PostTable() {
  const [params, setParams] = useQueryStates(postListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.posts.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )

  // Search filters
  const filterFields: DataTableFilterField<Post>[] = [
    {
      id: "title",
      label: "Title",
      placeholder: "Filter by title...",
    },
  ]

  const { table } = useDataTable({
    data: data?.posts ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: params.perPage },
      sorting: params.sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Blog Posts"
        total={data?.postsTotal}
        callToAction={
          <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
            <Link href="/admin/posts/new">
              <div className="max-sm:sr-only">New post</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          isFiltered={!isDefaultState(postListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <PostTableToolbarActions table={table} />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
