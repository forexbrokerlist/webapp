import { Suspense } from "react"
import { BookmarkListing } from "~/app/(web)/dashboard/bookmarks/listing"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"

export default async function (props: PageProps<"/dashboard/bookmarks">) {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <BookmarkListing {...props} />
    </Suspense>
  )
}
