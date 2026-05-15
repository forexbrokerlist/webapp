import type { ComponentProps } from "react"
import { cx } from "~/lib/utils"

import { SearchX } from "lucide-react"

export const EmptyList = ({ children, className, ...props }: ComponentProps<"div">) => {
  return (
    <div 
      className={cx(
        "col-span-full flex flex-col items-center justify-center p-12 text-center bg-black/5 rounded-2xl border border-black/10",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-center size-16 bg-white rounded-full shadow-sm mb-4">
        <SearchX className="size-6 text-muted-foreground/60" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-1">No results found</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {children || "We couldn't find anything matching your current filters. Try adjusting them to see more results."}
      </p>
    </div>
  )
}
