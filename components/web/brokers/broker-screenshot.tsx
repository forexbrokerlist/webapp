"use client"

import { useState } from "react"
import { Skeleton } from "~/components/common/skeleton"
import { cx } from "~/lib/utils"

type BrokerScreenshotProps = {
  src: string
  alt: string
  className?: string
}

export const BrokerScreenshot = ({ src, alt, className }: BrokerScreenshotProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cx("relative w-full h-full", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full z-10" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cx(
          "w-full h-full object-cover object-top transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  )
}
