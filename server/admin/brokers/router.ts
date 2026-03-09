import { after } from "next/server"
import { z } from "zod"
import { ToolStatus } from "~/.generated/prisma/client"
import { removeS3Directories } from "~/lib/media"
import { notifySubmitterOfToolPublished, notifySubmitterOfToolScheduled } from "~/lib/notifications"
import { adminProcedure } from "~/lib/orpc"
import { findScheduledBrokers, findBrokerList, findBrokers } from "~/server/admin/brokers/queries"
import { brokerListSchema, brokerSchema } from "~/server/admin/brokers/schema"

export const brokerIdSchema = z.object({ id: z.number() })
export const brokerIdsSchema = z.object({ ids: z.array(z.number()) })

const list = adminProcedure.input(brokerListSchema).handler(async ({ input }) => {
  // Since findBrokers doesn't implement pagination out of the box like findTools, we would map it here.
  // For now just pass it as is, or we'd write a proper query builder.
  return { tools: await findBrokers(input), total: 0, pageCount: 0 }
})

const lookup = adminProcedure.handler(async () => {
  return findBrokerList()
})

const scheduled = adminProcedure
  .input(z.object({ start: z.coerce.date(), end: z.coerce.date() }))
  .handler(async ({ input: { start, end } }) => {
    return findScheduledBrokers({
      where: { publishedAt: { gte: start, lte: end } },
    })
  })

const upsert = adminProcedure
  .input(brokerSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, notifySubmitter, categoryIds, subcategoryIds, tagIds, ...data } = input
    const existingBroker = id ? await db.brokers.findUnique({ where: { id } }) : null

    // Fallback URL generation if missing
    const slug = data.slug || ""

    const broker = id
      ? await db.brokers.update({
          where: { id },
          data: {
            ...data,
            slug,
            categories: {
              set: categoryIds?.map(id => ({ id })),
            },
            subcategories: {
              set: subcategoryIds?.map(id => ({ id })),
            },
            tags: {
              set: tagIds?.map(id => ({ id })),
            },
          },
        })
      : await db.brokers.create({
          data: {
            ...data,
            slug,
            categories: {
              connect: categoryIds?.map(id => ({ id })),
            },
            subcategories: {
              connect: subcategoryIds?.map(id => ({ id })),
            },
            tags: {
              connect: tagIds?.map(id => ({ id })),
            },
          },
        })

    after(async () => {
      if (notifySubmitter && existingBroker && existingBroker.status !== broker.status) {
        // notifySubmitterOfToolPublished(broker) // Omitted for now unless adapted 
        // notifySubmitterOfToolScheduled(broker)
      }
    })

    revalidate({
      tags: ["brokers", `broker-${broker.slug}`, "schedule"],
    })

    return broker
  })

const duplicate = adminProcedure
  .input(brokerIdSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const broker = await db.brokers.findUnique({
      where: { id },
    })

    if (!broker) {
      throw new Error("Broker not found")
    }

    const { id: _, ...brokerData } = broker

    const newBroker = await db.brokers.create({
      data: {
        ...brokerData,
        broker_name: `${broker.broker_name || 'Copy'} (Copy)`,
        slug: "",
      },
    })

    revalidate({
      tags: ["brokers"],
    })

    return newBroker
  })

const remove = adminProcedure
  .input(brokerIdsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    const brokers = await db.brokers.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.brokers.deleteMany({
      where: { id: { in: ids } },
    })

    after(async () => {
      await removeS3Directories(brokers.map(({ slug }) => `brokers/${slug}`))
    })

    revalidate({
      tags: ["brokers"],
    })

    return true
  })

const updateStatus = adminProcedure
  .input(z.object({ 
    id: z.number(), 
    status: z.enum(ToolStatus),
    publishedAt: z.coerce.date().nullish()
  }))
  .handler(async ({ input: { id, status, publishedAt }, context: { db, revalidate } }) => {
    const broker = await db.brokers.update({
      where: { id },
      data: { 
        status,
        publishedAt: status === ToolStatus.Published ? (publishedAt || new Date()) : 
                   status === ToolStatus.Draft ? null : publishedAt
      },
    })

    revalidate({
      tags: ["brokers", `broker-${broker.slug}`, "schedule"],
    })

    return broker
  })

export const brokerRouter = {
  list,
  lookup,
  scheduled,
  upsert,
  duplicate,
  remove,
  updateStatus,
}
