import { isTruthy } from "@primoui/utils";
import { endOfDay, startOfDay } from "date-fns";
import type { Prisma } from "~/.generated/prisma/client";
import type { PostListParams } from "~/server/admin/posts/schema";
import { db } from "~/services/db";

export const findPosts = async (
  search: PostListParams,
  where?: Prisma.PostWhereInput,
) => {
  const { title, page, perPage, sort, from, to, operator } = search;

  // Offset to paginate the results
  const offset = (page - 1) * perPage;

  // Column and order to sort by
  const orderBy = sort.map(
    (item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const,
  );

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined;
  const toDate = to ? endOfDay(new Date(to)) : undefined;

  const expressions: (Prisma.PostWhereInput | undefined)[] = [
    // Filter by title
    title ? { title: { contains: title, mode: "insensitive" } } : undefined,

    // Filter by publishedAt
    fromDate || toDate
      ? { publishedAt: { gte: fromDate, lte: toDate } }
      : undefined,
  ];

  const whereQuery: Prisma.PostWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  };

  // Transaction is used to ensure both queries are executed in a single transaction
  const [posts, postsTotal] = await db.$transaction([
    db.post.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { publishedAt: "desc" }],
      take: perPage,
      skip: offset,
      include: {
        author: { select: { name: true, image: true } },
        faqs: {
          orderBy: { order: "asc" },
        },
      },
    }),

    db.post.count({
      where: { ...whereQuery, ...where },
    }),
  ]);

  const pageCount = Math.ceil(postsTotal / perPage);
  return { posts, postsTotal, pageCount };
};

export const findPostById = async (id: string) => {
  return db.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true } },
      faqs: {
        orderBy: { order: "asc" },
      },
    },
  });
};
