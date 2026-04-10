"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"
import type { ComponentProps } from "react"
import { cx } from "~/lib/utils"

const Accordion = ({ ...props }: ComponentProps<typeof AccordionPrimitive.Root>) => {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

const AccordionItem = ({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cx("border border-[#E7E7E7] rounded-[12px] bg-white overflow-hidden transition-all", className)}
      {...props}
    />
  )
}

const AccordionTrigger = ({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) => {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cx(
          "group flex flex-1 items-center justify-between gap-4 p-4 text-left text-lg tracking-[-0.15px] font-semibold text-black100 transition-all outline-none",
          "focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <div className="relative shrink-0 flex items-center justify-center w-[22px] h-[22px] rounded-full border border-[#6B857D] text-[#6B857D]">
          <Plus className="size-3.5 absolute transition-all duration-300 scale-100 opacity-100 group-data-[state=open]:scale-50 group-data-[state=open]:opacity-0" strokeWidth={1.5} />
          <Minus className="size-3.5 absolute transition-all duration-300 scale-50 opacity-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" strokeWidth={1.5} />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

const AccordionContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden w-full text-sm text-pretty"
      {...props}
    >
      <div className={cx("px-5 pb-5 pt-0 text-base font-medium text-[#7D7D7D] max-w-[100%]", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
