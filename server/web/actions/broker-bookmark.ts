"use server"

import { z } from "zod"
import { userActionClient } from "~/lib/safe-actions"
import { db } from "~/services/db"

const brokerBookmarkInputSchema = z.object({
  brokerId: z.number().int().positive(),
})

export const checkBrokerBookmark = userActionClient
  .inputSchema(async () => brokerBookmarkInputSchema)
  .action(async ({ parsedInput: { brokerId }, ctx: { user } }) => {
    const bookmark = await db.bookmark.findUnique({
      where: { userId_brokerId: { userId: user.id, brokerId } },
      select: { id: true },
    })

    return { bookmarked: Boolean(bookmark) }
  })

export const setBrokerBookmark = userActionClient
  .inputSchema(async () => brokerBookmarkInputSchema.extend({ bookmarked: z.boolean() }))
  .action(async ({ parsedInput: { brokerId, bookmarked }, ctx: { user, revalidate } }) => {
    if (bookmarked) {
      await db.bookmark.upsert({
        where: { userId_brokerId: { userId: user.id, brokerId } },
        update: {},
        create: { userId: user.id, brokerId },
      })
    } else {
      await db.bookmark.deleteMany({
        where: { userId: user.id, brokerId },
      })
    }

    revalidate({
      paths: ["/dashboard/bookmarks"],
      tags: ["bookmarks", `broker-bookmark-${brokerId}`],
    })

    return { bookmarked }
  })

export const removeBrokerBookmark = userActionClient
  .inputSchema(async () => brokerBookmarkInputSchema)
  .action(async ({ parsedInput: { brokerId }, ctx: { user, revalidate } }) => {
    await db.bookmark.deleteMany({
      where: { userId: user.id, brokerId },
    })

    revalidate({
      paths: ["/dashboard/bookmarks"],
      tags: ["bookmarks", `broker-bookmark-${brokerId}`],
    })

    return { removed: true }
  })
