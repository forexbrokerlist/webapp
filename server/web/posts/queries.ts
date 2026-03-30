import { cache } from "react";
import { getPresignedUrlFromFull } from "~/lib/media";
import { db } from "~/services/db";

export const getPosts = cache(async () => {
  const posts = await db.post.findMany({
    where: { status: "Published" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true, image: true } } },
  });

  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      image: post.image ? await getPresignedUrlFromFull(post.image) : null,
    })),
  );
});

export const getPostBySlug = cache(async (slug: string) => {
  const post = await db.post.findUnique({
    where: { slug, status: "Published" },
    include: {
      author: { select: { name: true, image: true, id: true } },
      faqs: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!post) return null;

  return {
    ...post,
    image: post.image ? await getPresignedUrlFromFull(post.image) : null,
  };
});
