import { after } from "next/server";
import { z } from "zod";
import { ToolStatus } from "~/.generated/prisma/client";
import { removeS3Directories } from "~/lib/media";
import {
  notifySubmitterOfToolPublished,
  notifySubmitterOfToolScheduled,
} from "~/lib/notifications";
import { adminProcedure } from "~/lib/orpc";
import {
  findScheduledBrokers,
  findBrokerList,
  findBrokers,
} from "~/server/admin/brokers/queries";
import { brokerListSchema, brokerSchema } from "~/server/admin/brokers/schema";

export const brokerIdSchema = z.object({ id: z.coerce.number() });
export const brokerIdsSchema = z.object({ ids: z.array(z.coerce.number()) });

const list = adminProcedure
  .input(brokerListSchema)
  .handler(async ({ input }) => {
    return findBrokers(input);
  });

const lookup = adminProcedure.handler(async () => {
  return findBrokerList();
});

const scheduled = adminProcedure
  .input(z.object({ start: z.coerce.date(), end: z.coerce.date() }))
  .handler(async ({ input: { start, end } }) => {
    return findScheduledBrokers({
      where: { publishedAt: { gte: start, lte: end } },
    });
  });

const upsert = adminProcedure
  .input(brokerSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const {
      id,
      notifySubmitter,
      categoryIds,
      subcategoryIds,
      tagIds,
      faqs,
      courseModules,
      ...data
    } = input;
    const existingBroker = id
      ? await db.brokers.findUnique({ where: { id } })
      : null;

    // Fallback URL generation if missing
    const slug = data.slug || "";

    const broker = id
      ? await db.brokers.update({
          where: { id },
          data: {
            ...data,
            slug,
            categories: {
              set: categoryIds?.map((id) => ({ id })),
            },
            subcategories: {
              set: subcategoryIds?.map((id) => ({ id })),
            },
            tags: {
              set: tagIds?.map((id) => ({ id })),
            },
            faqs: {
              deleteMany: {},
              create: faqs?.map((f, i) => ({
                question: f.question,
                answer: f.answer,
                order: i,
              })),
            },
            courseModules: {
              deleteMany: {},
              create: courseModules?.map((module, i) => ({
                title: module.title,
                difficulty: module.difficulty,
                duration: module.duration,
                topics: module.topics || [],
                order: module.order || i + 1,
              })),
            },
          },
        })
      : await db.brokers.create({
          data: {
            ...data,
            slug,
            categories: {
              connect: categoryIds?.map((id) => ({ id })),
            },
            subcategories: {
              connect: subcategoryIds?.map((id) => ({ id })),
            },
            tags: {
              connect: tagIds?.map((id) => ({ id })),
            },
            faqs: {
              create: faqs?.map((f, i) => ({
                question: f.question,
                answer: f.answer,
                order: i,
              })),
            },
            courseModules: {
              create: courseModules?.map((module, i) => ({
                title: module.title,
                difficulty: module.difficulty,
                duration: module.duration,
                topics: module.topics || [],
                order: module.order || i + 1,
              })),
            },
          },
        });

    after(async () => {
      if (
        notifySubmitter &&
        existingBroker &&
        existingBroker.status !== broker.status
      ) {
        // notifySubmitterOfToolPublished(broker) // Omitted for now unless adapted
        // notifySubmitterOfToolScheduled(broker)
      }
    });

    revalidate({
      tags: ["brokers", `broker-${broker.slug}`, "schedule"],
    });

    return broker;
  });

const duplicate = adminProcedure
  .input(brokerIdSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const broker = await db.brokers.findUnique({
      where: { id },
    });

    if (!broker) {
      throw new Error("Broker not found");
    }

    const { id: _, ...brokerData } = broker;

    const newBroker = await db.brokers.create({
      data: {
        ...brokerData,
        broker_name: `${broker.broker_name || "Copy"} (Copy)`,
        slug: "",
      },
    });

    revalidate({
      tags: ["brokers"],
    });

    return newBroker;
  });

const remove = adminProcedure
  .input(brokerIdsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    const brokers = await db.brokers.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    });

    await db.brokers.deleteMany({
      where: { id: { in: ids } },
    });

    after(async () => {
      await removeS3Directories(brokers.map(({ slug }) => `brokers/${slug}`));
    });

    revalidate({
      tags: ["brokers"],
    });

    return true;
  });

const updateStatus = adminProcedure
  .input(
    z.object({
      id: z.coerce.number(),
      status: z.enum(ToolStatus),
      publishedAt: z.coerce.date().nullish(),
    }),
  )
  .handler(
    async ({
      input: { id, status, publishedAt },
      context: { db, revalidate },
    }) => {
      const broker = await db.brokers.update({
        where: { id },
        data: {
          status,
          publishedAt:
            status === ToolStatus.Published
              ? publishedAt || new Date()
              : status === ToolStatus.Draft
                ? null
                : publishedAt,
        },
      });

      revalidate({
        tags: ["brokers", `broker-${broker.slug}`, "schedule"],
      });

      return broker;
    },
  );

export const brokerRouter = {
  list,
  lookup,
  scheduled,
  upsert,
  duplicate,
  remove,
  updateStatus,
  reorder: adminProcedure
    .input(
      z.object({
        ids: z.array(z.coerce.number()),
        newIds: z.array(z.number()).optional(),
      }),
    )
    .handler(
      async ({ input: { ids, newIds }, context: { db, revalidate } }) => {
        console.log("Reorder API called", {
          oldIdsCount: ids.length,
          newIdsCount: newIds?.length || 0,
        });
        try {
          await db.$transaction(
            async (tx) => {
              // Update with new IDs if provided
              if (newIds && newIds.length > 0) {
                for (let i = 0; i < newIds.length; i++) {
                  console.log(
                    `[DB UPDATE] ID: ${ids[i]} -> New ID: ${newIds[i]}`,
                  );
                  await tx.brokers.update({
                    where: { id: ids[i] },
                    data: { id: newIds[i] },
                  });
                }
              } else {
                // Fallback to order-based reordering
                for (let i = 0; i < ids.length; i++) {
                  const newOrder = i + 1;
                  console.log(
                    `[DB SAVE] ID: ${ids[i]} -> New Order: ${newOrder}`,
                  );
                  await tx.brokers.update({
                    where: { id: ids[i] },
                    data: { order: newOrder },
                  });
                }
              }
            },
            { timeout: 30000 },
          );

          revalidate({
            tags: ["brokers"],
          });
          console.log("Reorder successful");
          return true;
        } catch (error) {
          console.error("Reorder failed", error);
          throw error;
        }
      },
    ),
};
