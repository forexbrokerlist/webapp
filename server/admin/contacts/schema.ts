import { z } from "zod"

export const contactUsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const fetchContactsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const deleteContactSchema = z.object({
  id: z.string(),
})

export const contactListParams = {
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

export type ContactUsMessage = z.infer<typeof contactUsSchema>
export type FetchContactsInput = z.infer<typeof fetchContactsSchema>
export type DeleteContactInput = z.infer<typeof deleteContactSchema>
