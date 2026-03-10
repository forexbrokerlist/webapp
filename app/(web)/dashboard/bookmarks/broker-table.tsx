"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { BookmarkXIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useQueryStates } from "nuqs"
import { useMemo } from "react"
import { toast } from "sonner"
import type { Brokers } from "~/.generated/prisma/client"
import { Button } from "~/components/common/button"
import { Note } from "~/components/common/note"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { useDataTable } from "~/hooks/use-data-table"
import type { findBookmarkedBrokers } from "~/server/shared/tools/queries"
import { toolListParams } from "~/server/shared/tools/schema"
import { removeBrokerBookmark } from "~/server/web/actions/broker-bookmark"
import type { DataTableFilterField } from "~/types"

type BrokerBookmarkRemoveButtonProps = {
  brokerId: number
}

const BrokerBookmarkRemoveButton = ({ brokerId }: BrokerBookmarkRemoveButtonProps) => {
  const t = useTranslations("pages.dashboard.table")
  const router = useRouter()

  const { execute, isPending } = useAction(removeBrokerBookmark, {
    onSuccess: () => {
      toast.success(t("bookmarks.success_message"))
      router.refresh()
    },
    onError: ({ error }) => {
      toast.error(error.serverError || t("bookmarks.error_message"))
    }
  })

  return (
    <Button
      size="sm"
      variant="secondary"
      prefix={<BookmarkXIcon />}
      onClick={() => execute({ brokerId })}
      isPending={isPending}
      className="float-right -my-1"
    >
      {t("bookmarks.remove_button")}
    </Button>
  )
}

export const BrokerBookmarkTable = ({ brokers, pageCount }: Awaited<ReturnType<typeof findBookmarkedBrokers>>) => {
  const t = useTranslations("pages.dashboard.table")
  const [{ perPage }] = useQueryStates(toolListParams)

  const columns = useMemo((): ColumnDef<Brokers>[] => {
    return [
      {
        accessorKey: "broker_name",
        size: 160,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.name")} />,
        cell: ({ row }) => {
          const { broker_name, slug } = row.original
          // Construct favicon conditionally. We can use google favicon generator.
          let domain = "forex.com"
          const targetUrl = row.original.broker_website || row.original.url
          if (targetUrl) {
            try {
              const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`)
              domain = urlObj.hostname
            } catch (e) {}
          }
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          
          return <DataTableLink href={`/brokers/${slug}`} image={faviconUrl} title={broker_name || "Broker"} />
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("columns.tagline")} />
        ),
        cell: ({ row }) => <Note className="truncate max-w-sm">{row.original.description || row.original.pros}</Note>,
      },
      {
        id: "actions",
        cell: ({ row }) => <BrokerBookmarkRemoveButton brokerId={row.original.id} />,
      },
    ]
  }, [])

  const filterFields: DataTableFilterField<Brokers>[] = [
    {
      id: "broker_name",
      label: t("filters.name_label"),
      placeholder: t("filters.name_placeholder"),
    },
  ]

  const { table } = useDataTable({
    data: brokers,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    enableHiding: false,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      columnPinning: { right: ["actions"] },
    },
    getRowId: row => row.slug ?? String(row.id),
  })

  return (
    <DataTable table={table} emptyState={t("bookmarks.empty_state")}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}
