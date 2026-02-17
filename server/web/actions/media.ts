"use server"

import { getTranslations } from "next-intl/server"
import { fetchAndUploadMedia, uploadToS3Storage } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import { createFetchMediaSchema, createUploadMediaSchema } from "~/server/web/shared/schema"

export const fetchMedia = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createFetchMediaSchema(t)
  })
  .action(async ({ parsedInput: { url, path, type } }) => {
    return fetchAndUploadMedia(url, path, type)
  })

export async function uploadMedia(formData: FormData) {
  const t = await getTranslations("schema")
  const schema = createUploadMediaSchema(t)

  const { data, error } = schema.safeParse({
    path: formData.get("path"),
    file: formData.get("file"),
  })

  if (error) {
    return { error: error.issues[0]?.message }
  }

  const buffer = Buffer.from(await data.file.arrayBuffer())
  const url = await uploadToS3Storage(buffer, data.path)

  return { data: url }
}
