import Image from "next/image"
import type { ComponentProps, ReactNode } from "react"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"

export type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image: string | null
  url?: string | null
  note?: ReactNode
}

export const Author = ({ name, image, prefix, url, note, ...props }: AuthorProps) => {
  return (
    <div wrap={false} {...props}>
      <div className="flex justify-center pb-4">
        {image && (
          <Image
            src={image}
            alt={`${name}'s profile`}
            width={48}
            height={48}
            className="size-10 rounded-full group-hover:[[href]]:brightness-90"
          />
        )}

      </div>
      <div className="">
        <h3 className="text-base font-medium text-black100 text-center">
          {prefix ? `${prefix} ` : ""}
          {url ? <ExternalLink href={url as string}>{name}</ExternalLink> : <span>{name}</span>}
        </h3>

        {note && <span className="text-sm text-black700 text-center block font-medium">{note}</span>}
      </div>
    </div>
  )
}
