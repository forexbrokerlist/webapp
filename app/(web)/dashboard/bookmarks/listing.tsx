import { redirect } from "next/navigation"
import { BrokerBookmarkTable } from "~/app/(web)/dashboard/bookmarks/broker-table"
import { getServerSession } from "~/lib/auth"
import { findBookmarkedBrokers } from "~/server/shared/tools/queries"
import { toolListCache } from "~/server/shared/tools/schema"

export const BookmarkListing = async ({ searchParams }: PageProps<"/dashboard/bookmarks">) => {
  const currentSearchParams = await searchParams
  const params = toolListCache.parse(currentSearchParams)
  const session = await getServerSession()

  if (!session?.user) {
    throw redirect("/auth/login?next=/dashboard/bookmarks")
  }

  const brokersQuery = await findBookmarkedBrokers(params, {
    bookmarks: { some: { userId: session.user.id } },
  })

  return (
    <div className="flex flex-col gap-6">
      <BrokerBookmarkTable {...brokersQuery!} />
    </div>
  )
}
