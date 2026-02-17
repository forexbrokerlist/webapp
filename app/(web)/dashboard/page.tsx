import { Suspense } from "react"
import { DashboardToolListing } from "~/app/(web)/dashboard/listing"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"

export default async function (props: PageProps<"/dashboard">) {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <DashboardToolListing {...props} />
    </Suspense>
  )
}
