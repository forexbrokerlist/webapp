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
      <div className="sticky top-0 z-20 p-5 border-b border-border/60 bg-background/60 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
              {fullReport ? "Market Analysis Report" : "Awaiting Analysis"}
            </h3>
            {fullReport && (
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Comprehensive Forex Insights</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="fancy"
              size="sm"
              className="rounded-2xl px-6 bg-linear-to-r from-indigo-500 to-blue-600 text-white border-none shadow-md shadow-indigo-500/10 hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-xs"
              onClick={handleDownload}
              disabled={!fullReport}
              prefix={<FileText className="h-3.5 w-3.5 mr-0.5" />}
            >
              Export Report
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
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-700">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                      <div className="relative bg-linear-to-b from-indigo-500/10 to-transparent p-8 rounded-full border border-indigo-500/10">
                        <FileText className="h-16 w-16 text-indigo-500/40" strokeWidth={1} />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Ready for Analysis</h4>
                    <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                      Select a currency pair in the chat and ask FxGURU for any market insights or professional analysis reports.
                    </p>
                    <div className="mt-8 flex gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/40"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/20"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/10"></div>
                    </div>
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
