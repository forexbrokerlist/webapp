"use server"

import { z } from "zod"
import { userActionClient } from "~/lib/safe-actions"
import { db } from "~/services/db"

const bookmarkInputSchema = z.object({
  toolId: z.string().min(1),
})

export const checkBookmark = userActionClient
  .inputSchema(async () => bookmarkInputSchema)
  .action(async ({ parsedInput: { toolId }, ctx: { user } }) => {
    const bookmark = await db.bookmark.findUnique({
      where: { userId_toolId: { userId: user.id, toolId } },
      select: { id: true },
    })

    return { bookmarked: Boolean(bookmark) }
  })

export const setBookmark = userActionClient
  .inputSchema(async () => bookmarkInputSchema.extend({ bookmarked: z.boolean() }))
  .action(async ({ parsedInput: { toolId, bookmarked }, ctx: { user, revalidate } }) => {
    if (bookmarked) {
      await db.bookmark.upsert({
        where: { userId_toolId: { userId: user.id, toolId } },
        update: {},
        create: { userId: user.id, toolId },
      })
    } else {
      await db.bookmark.deleteMany({
        where: { userId: user.id, toolId },
      })
    }

    revalidate({
      paths: ["/dashboard/bookmarks"],
      tags: ["bookmarks", `bookmark-${toolId}`],
    })

    return { bookmarked }
  })

export const removeBookmark = userActionClient
  .inputSchema(async () => bookmarkInputSchema)
  .action(async ({ parsedInput: { toolId }, ctx: { user, revalidate } }) => {
    await db.bookmark.deleteMany({
      where: { userId: user.id, toolId },
    })

    revalidate({
      paths: ["/dashboard/bookmarks"],
      tags: ["bookmarks", `bookmark-${toolId}`],
    })

    return { removed: true }
  })
