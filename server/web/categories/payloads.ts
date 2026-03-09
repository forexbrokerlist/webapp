import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const categoryOnePayload = {
  id: true,
  name: true,
  slug: true,
  label: true,
  description: true,
  _count: { 
    select: { 
      tools: { where: { status: ToolStatus.Published } },
      brokers: { where: { status: ToolStatus.Published } }
    } 
  },
} satisfies Prisma.CategorySelect

export const categoryManyPayload = {
  id: true,
  name: true,
  slug: true,
  label: true,
  _count: { 
    select: { 
      tools: { where: { status: ToolStatus.Published } },
      brokers: { where: { status: ToolStatus.Published } }
    } 
  },
} satisfies Prisma.CategorySelect

export type CategoryOne = Prisma.CategoryGetPayload<{ select: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ select: typeof categoryManyPayload }>
