"use client"

import { Label as LabelPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx } from "~/lib/utils"

type LabelProps = ComponentProps<typeof LabelPrimitive.Root>

const Label = ({ className, ...props }: LabelProps) => {
  return (
    <LabelPrimitive.Root
      className={cx(
        "self-start text-sm font-medium text-foreground [[for]]:cursor-pointer",
        "data-required:after:-ml-1 data-required:after:text-red-600 data-required:after:content-['*']",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
