import { z } from "zod"

export const newsletterSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const fetchNewslettersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const deleteNewsletterSchema = z.object({
  id: z.string(),
})

export const newsletterListParams = {
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

export type Newsletter = z.infer<typeof newsletterSchema>
export type FetchNewslettersInput = z.infer<typeof fetchNewslettersSchema>
export type DeleteNewsletterInput = z.infer<typeof deleteNewsletterSchema>
