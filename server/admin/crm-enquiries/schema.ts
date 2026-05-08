import { z } from "zod"
import type { Prisma } from "~/.generated/prisma/client"

export const crmEnquiryListParams = {
  page: {
    defaultValue: 1,
    parse: (value: string) => parseInt(value) || 1,
    serialize: (value: number) => value.toString(),
  },
  perPage: {
    defaultValue: 10,
    parse: (value: string) => parseInt(value) || 10,
    serialize: (value: number) => value.toString(),
  },
  search: {
    defaultValue: "",
    parse: (value: string) => value,
    serialize: (value: string) => value,
  },
}

export const crmEnquiryListSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const crmEnquiryDeleteSchema = z.object({
  id: z.string().cuid(),
})

export type CRMEnquiryListItem = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  createdAt: Date
}

export type CRMEnquiryListResponse = {
  items: CRMEnquiryListItem[]
  total: number
  pageCount: number
}
