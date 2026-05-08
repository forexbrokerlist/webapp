import { z } from "zod"
import type { Prisma } from "~/.generated/prisma/client"

export const crmEnquiryListParams = {
  page: z.number().int().min(1).catch(1),
  perPage: z.number().int().min(1).max(100).catch(10),
  search: z.string().optional(),
}

export const crmEnquiryListSchema = z.object(crmEnquiryListParams)

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
