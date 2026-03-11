"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

type MarkdownEditorProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>
  height?: number
}

export const MarkdownEditor = <T extends FieldValues>({
  field,
  height = 480,
}: MarkdownEditorProps<T>) => {
  const { resolvedTheme } = useTheme()

  return (
    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
      <MDEditor
        value={field.value ?? ""}
        onChange={val => field.onChange(val ?? "")}
        height={height}
        preview="live"
        visibleDragbar={false}
        textareaProps={{
          placeholder: "Write your post content in Markdown...",
          id: field.name,
        }}
      />
    </div>
  )
}
