import { forwardRef, type ComponentProps } from "react"
import { Box, type boxVariants } from "~/components/common/box"
import { cva, cx, type VariantProps } from "~/lib/utils"

const inputVariants = cva({
  base: "appearance-none min-h-0 w-full border-border-light self-stretch bg-background text-foreground text-[0.8125rem]/tight break-words transition duration-150 disabled:text-secondary-foreground/50",

  variants: {
    size: {
      sm: "px-2 py-1 font-normal rounded-md",
      md: "px-3 py-2 rounded-md",
      lg: "px-4 py-2.5 rounded-lg sm:text-sm",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> &
  VariantProps<typeof boxVariants>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, hover = false, focus = true, ...props }, ref) => {
    return (
      <Box hover={hover} focus={focus}>
        <input ref={ref} className={cx(inputVariants({ size, className }))} {...props} />
      </Box>
    )
  },
)

Input.displayName = "Input"

export { Input, inputVariants }
