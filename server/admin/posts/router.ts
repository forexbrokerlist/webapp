import { adminProcedure } from "~/lib/orpc";
import { findPostById, findPosts } from "~/server/admin/posts/queries";
import { postListSchema, postSchema } from "~/server/admin/posts/schema";
import { idSchema, idsSchema } from "~/server/admin/shared/schema";

const list = adminProcedure.input(postListSchema).handler(async ({ input }) => {
  return findPosts(input);
});

const get = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id } }) => {
    return findPostById(id);
  });

const upsert = adminProcedure
  .input(postSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, faqs, ...data } = input;

    const post = id
      ? await db.post.update({
          where: { id },
          data: {
            ...data,
            slug: data.slug || "",
            faqs: {
              deleteMany: {},
              create:
                faqs?.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                  order: faq.order,
                  isActive: faq.isActive,
                })) || [],
            },
          },
          include: {
            faqs: true,
          },
        })
      : await db.post.create({
          data: {
            ...data,
            slug: data.slug || "",
            faqs: {
              create:
                faqs?.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                  order: faq.order,
                  isActive: faq.isActive,
                })) || [],
            },
          },
          include: {
            faqs: true,
          },
        });

    revalidate({
      tags: ["posts", `post-${post.slug}`],
    });

    return post;
  });

const duplicate = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const newPost = await db.post.create({
      data: {
        title: `${post.title} (Copy)`,
        slug: "",
        description: post.description,
        content: post.content,
        image: post.image,
        status: "Draft",
        authorId: post.authorId,
        locale: post.locale,
      },
    });

    revalidate({
      tags: ["posts"],
    });

    return newPost;
  });

const remove = adminProcedure
  .input(idsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    await db.post.deleteMany({
      where: { id: { in: ids } },
    });

    revalidate({
      tags: ["posts"],
    });

    return true;
  });

export const postRouter = {
  list,
  get,
  upsert,
  duplicate,
  remove,
};
