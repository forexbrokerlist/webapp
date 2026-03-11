import type { Post as PrismaPost } from "~/.generated/prisma/browser"

export type Post = Omit<PrismaPost, "image"> & {
  image: string | null | undefined
  author?: {
    name: string
    image: string | null
  } | null
}
