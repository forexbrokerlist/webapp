import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const tagOnePayload = {
  id: true,
  name: true,
  slug: true,
  _count: { select: { brokers: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.TagSelect

export const tagManyPayload = {
  id: true,
  name: true,
  slug: true,
  _count: { select: { brokers: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.TagSelect

export type TagOne = Prisma.TagGetPayload<{ select: typeof tagOnePayload }>
export type TagMany = Prisma.TagGetPayload<{ select: typeof tagManyPayload }>
