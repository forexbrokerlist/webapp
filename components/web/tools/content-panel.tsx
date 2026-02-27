"use client"

import { useRef, useEffect } from "react"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ContentPanelProps {
  fullReport?: string | null
  selectedShortReport?: string | null
  isLoading?: boolean
  blogLoading?: boolean
  scrollToTopSignal?: number
  handleGenerateBlog?: (data: string) => void
}

export function ContentPanel({
  fullReport,
  isLoading = false,
  blogLoading = false,
  scrollToTopSignal,
  selectedShortReport,
  handleGenerateBlog,
}: ContentPanelProps) {
  const scrollContentRef = useRef<HTMLDivElement>(null)

  // Scroll to top when scrollToTopSignal changes
  useEffect(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [scrollToTopSignal])

  // Download handler
  const handleDownload = () => {
    if (!fullReport) return
    const blob = new Blob([fullReport], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "market-analysis-report.doc"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 bg-background sm:bg-card/30 border-l border-border h-full min-h-[calc(100vh-(174px+var(--header-height)))] max-h-[calc(100vh-(174px+var(--header-height)))] overflow-hidden flex flex-col">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 p-4 border-b border-border bg-background/95 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">
            {fullReport ? "Market Analysis Report" : "No Report Selected"}
          </h3>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="secondary"
              size="sm"
              className="rounded-full px-4 border shadow-xs hover:border-primary/30 transition-all font-medium"
              onClick={() =>
                handleGenerateBlog?.(
                  JSON.stringify({
                    full_report: fullReport,
                    short_response: selectedShortReport,
                  })
                )
              }
              disabled={!fullReport}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 opacity-70" />
              Generate Blog
              {blogLoading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : null}
            </Button> */}
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center rounded-full px-4 border shadow-xs hover:border-primary/30 transition-all font-medium"
              onClick={handleDownload}
              disabled={!fullReport}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 opacity-70" />
              Download Document
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-6" ref={scrollContentRef}>
          <Card className="border-0 shadow-none bg-transparent">
            <div className="p-0">
              <div className="prose text-base markdown-text prose-sm max-w-none dark:prose-invert">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  </div>
                ) : fullReport ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {fullReport}
                  </ReactMarkdown>
                ) : (
                  <div className="text-muted-foreground text-center py-12">
                    <p className="text-lg font-medium mb-2">No report selected</p>
                    <p className="text-sm">
                      Send a message or select a report from the chat to view details here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
