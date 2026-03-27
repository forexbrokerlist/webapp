import type { Prisma } from "~/.generated/prisma/client"

export const adOnePayload = {
  id: true,
  name: true,
  description: true,
  websiteUrl: true,
  faviconUrl: true,
  bannerUrl: true,
  buttonLabel: true,
  type: true,
  status: true,
  categoryId: true,
  subcategoryId: true,
} satisfies Prisma.AdSelect

export const adManyPayload = {
  id: true,
  name: true,
  description: true,
  websiteUrl: true,
  faviconUrl: true,
  bannerUrl: true,
  buttonLabel: true,
  type: true,
  status: true,
  startsAt: true,
  endsAt: true,
  categoryId: true,
  subcategoryId: true,
} satisfies Prisma.AdSelect

export type AdOne = Prisma.AdGetPayload<{ select: typeof adOnePayload }>
export type AdMany = Prisma.AdGetPayload<{ select: typeof adManyPayload }>
