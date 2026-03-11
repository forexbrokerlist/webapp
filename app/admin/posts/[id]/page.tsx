import { notFound } from "next/navigation"
import { PostForm } from "~/app/admin/posts/_components/post-form"
import { Wrapper } from "~/components/common/wrapper"
import { findPostById } from "~/server/admin/posts/queries"

export default async function ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await findPostById(id)

  if (!post) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <PostForm title="Update post" post={post as any} />
    </Wrapper>
  )
}
