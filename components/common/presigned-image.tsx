"use client"

import Image from "next/image"
import { type ComponentProps, useEffect, useState } from "react"
import { generatePresignedUrl } from "~/server/web/actions/media"

type PresignedImageProps = ComponentProps<typeof Image> & {
  src: string | null | undefined
}

export const PresignedImage = ({ src, alt, ...props }: PresignedImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(src || null)

  useEffect(() => {
    let active = true

    const loadPreview = async () => {
      if (!src) {
        if (active) setImageUrl(null)
        return
      }

      // Automatically generate a presigned URL if not already one or if it's a raw S3 URL.
      const url = await generatePresignedUrl(src)

      if (active) {
        setImageUrl(url ?? null)
      }
    }

    void loadPreview()
    return () => {
      active = false
    }
  }, [src])

  if (!imageUrl) return null

  return <Image src={imageUrl} alt={alt} {...props} />
}
