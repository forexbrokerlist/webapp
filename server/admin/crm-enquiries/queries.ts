import { db } from "~/services/db"
import type { 
  crmEnquiryListSchema, 
  crmEnquiryDeleteSchema,
  CRMEnquiryListResponse 
} from "./schema"
import { z } from "zod"

export const listCRMEnquiries = async (
  input: z.infer<typeof crmEnquiryListSchema>
): Promise<CRMEnquiryListResponse> => {
  const { page, perPage, search } = input
  const skip = (page - 1) * perPage
  const take = perPage

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { phone: { contains: search, mode: 'insensitive' as const } },
      { message: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {}

  const [items, total] = await Promise.all([
    db.cRMEnquiry.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    db.cRMEnquiry.count({ where }),
  ])

  return {
    items,
    total,
    pageCount: Math.ceil(total / perPage),
  }
}

export const deleteCRMEnquiry = async (
  input: z.infer<typeof crmEnquiryDeleteSchema>
) => {
  return db.cRMEnquiry.delete({
    where: { id: input.id },
  })
}
