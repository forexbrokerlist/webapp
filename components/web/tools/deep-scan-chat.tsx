"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Send, Loader2, PanelLeftClose, PanelLeft, Plus, Trash2, ChevronDown, Check } from "lucide-react"
import { Button } from "~/components/common/button"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "~/lib/auth-client"
import { useRouter } from "next/navigation"
import { apiClient } from "~/lib/api-client"
import { ContentPanel } from "./content-panel"
import { useStreamingTask } from "~/hooks/useStreamingTask"
import { MultiTaskProgress } from "./multi-task-progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/web/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"

interface ScanItem {
  task_id: string
  question: string
  model_used: string
  status: string
  created_at: string
  answer?: string
  deep_research_answer?: string
}


const DEEP_SCAN_MC_PATH = "deep-research/v1"

const Model_List = [
  { Value: "lite", Name: "CORE", Duration: "2MIN – 10MIN" },
  { Value: "pro", Name: "ADVANCED", Duration: "5MIN – 25MIN" },
  { Value: "ultra", Name: "ELITE", Duration: "25MIN – 50MIN" },
  { Value: "ultra2x", Name: "PRIME", Duration: "50MIN – 90MIN" },
]

const Template_INFO = [
  { Text: "RBI Policy Impact", Query: "What is the impact of the latest RBI policy?" },
  { Text: "Market Efficiency", Query: "How efficient is the current stock market?" },
  { Text: "Post-COVID Markets", Query: "How have markets behaved post-COVID?" },
]

export function DeepScanChat() {
  const { data: session, isPending } = useSession()
   
  const userId = session?.user?.id 
  const router = useRouter()
  const [history, setHistory] = useState<ScanItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Set sidebar open by default on desktop after mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    }
  }, [])
  // Auto-redirect removed to allow guest access
  const [activeScan, setActiveScan] = useState<ScanItem | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState(Model_List[0].Value)
  const [pendingRequests, setPendingRequests] = useState(0)
  const isLoading = pendingRequests > 0
  const [contentPanelScrollKey, setContentPanelScrollKey] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scanToDelete, setScanToDelete] = useState<string | null>(null)

  // Use the new streaming task hook
  const { tasks, startTask, pollTask, cancelTask, clearTask, clearAllTasks } = useStreamingTask()

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const response = await apiClient.get(`${DEEP_SCAN_MC_PATH}/history?created_by=${userId}&page=1&limit=50`)
      if (response.data?.data?.history) {
        const fetchedHistory = response.data.data.history
        setHistory(fetchedHistory)
        
        // Start polling for any tasks that are still running
        fetchedHistory.forEach((item: ScanItem) => {
          if (item.status === 'in_progress' || item.status === 'running') {
            pollTask(item.task_id, item.task_id, item.question, item.model_used)
          }
        })
      }
    } catch (error) {
      console.error("Failed to fetch history", error)
    } finally {
      setHistoryLoading(false)
    }
  }, [pollTask,userId])

  useEffect(() => {
    if (userId) {
      fetchHistory()
    }
  }, [fetchHistory, userId])

  // Unified list of scans (history + active tasks)
  const displayedScans = (() => {
    const combined = [...history]
    Object.values(tasks).forEach(task => {
      const existingIndex = combined.findIndex(item => item.task_id === task.task_id)
      const scanFromTask: ScanItem = {
        task_id: task.task_id,
        question: task.query,
        model_used: task.model,
        status: task.status === 'running' ? 'in_progress' : task.status,
        created_at: task.created_at,
        answer: task.result?.answer || task.result?.response?.short_response,
        deep_research_answer: task.result?.full_report || task.result?.answer,
      }

      if (existingIndex !== -1) {
        combined[existingIndex] = { ...combined[existingIndex], ...scanFromTask }
      } else {
        combined.unshift(scanFromTask)
      }
    })
    return combined
  })()

  // Update history when tasks complete
  useEffect(() => {
    const completedTasks = Object.values(tasks).filter(task => task.status === 'completed' && task.result)

    completedTasks.forEach(task => {
      const newScan: ScanItem = {
        task_id: task.task_id,
        question: task.query,
        model_used: task.model,
        status: "completed",
        created_at: task.created_at,
        answer: task.result.answer || task.result.response?.short_response || "Deep Scan completed.",
        deep_research_answer: task.result.full_report || task.result.answer || "Deep Scan completed.",
      }

      setHistory(prev => {
        const index = prev.findIndex(item => item.task_id === task.task_id)
        if (index === -1) {
          return [newScan, ...prev]
        } else {
          const updated = [...prev]
          updated[index] = newScan
          return updated
        }
      })

      // Set as active scan if no active scan
      if (!activeScan) {
        setActiveScan(newScan)
        setContentPanelScrollKey(prev => prev + 1)
      }
    })
  }, [tasks, activeScan])

  const handleSend = (queryOverride?: string) => {
    if (!session) {
      router.push(`/auth/login?next=/deep-scan`);
      return;
    }
    const query = queryOverride || inputValue
    if (!query.trim()) return

    setPendingRequests(p => p + 1)
    setInputValue("")

    // Execute the task in the background to ensure immediate UI responsiveness
    ;(async () => {
      try {
        await startTask(query, selectedModel)
      } catch (error) {
        console.error("Error starting task:", error)
      } finally {
        setPendingRequests(p => p - 1)
      }
    })()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startNewScan = () => {
    setActiveScan(null)
    setInputValue("")
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleDeleteHistory = (taskId: string) => {
    setScanToDelete(taskId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!scanToDelete) return

    try {
      const response = await apiClient.delete(`${DEEP_SCAN_MC_PATH}/history?task_id=${scanToDelete}`)
      if (response.data?.success || response.status === 200) {
        setHistory(prev => prev.filter(item => item.task_id !== scanToDelete))
        if (activeScan?.task_id === scanToDelete) {
          setActiveScan(null)
        }
      }
    } catch (error) {
      console.error("Failed to delete history item", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setScanToDelete(null)
    }
  }

  return (
    <div data-slot="deep-scan-container" className="flex-1 w-full flex bg-[#eef2f6] dark:bg-background p-2 md:p-4 gap-0 md:gap-4 overflow-hidden relative min-h-[calc(100vh-174px-var(--header-height))] max-h-[calc(100vh-174px-var(--header-height))] no-scrollbar">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 z-40 w-[280px] md:relative md:inset-auto md:z-auto md:w-[300px] shrink-0 flex flex-col bg-white dark:bg-card rounded-r-2xl md:rounded-[24px] shadow-xl md:shadow-sm border-r md:border border-border overflow-hidden whitespace-nowrap"
          >
            <div className="p-4 flex gap-2">
              <Button
                onClick={startNewScan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-[42px] shadow-sm font-semibold transition-colors"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" /> New Scan  </div>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsSidebarOpen(false)}
                className="w-[42px] h-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 
                shadow-sm p-0 flex items-center justify-center shrink-0 transition-colors"
                title="Close Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center px-6 py-2">
              <div className="h-px bg-border flex-1"></div>
              <span className="px-3 text-[11px] font-semibold text-muted-foreground tracking-wide">My Scans</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="flex-1 p-3 lg:p-4 overflow-y-auto no-scrollbar scroll-smooth">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-sm">Loading history...</span>
                </div>
              ) : displayedScans.length > 0 ? (
          <Accordion type="single" collapsible className="flex flex-col gap-3">
  {displayedScans.map((scan) => {
    // Find task in hook state - either by its key (timestamp or backend id) 
    // or by looking for a task whose internal task_id matches scan.task_id
    const task = tasks[scan.task_id] || Object.values(tasks).find(t => t.task_id === scan.task_id)
    const stages = task?.stages || []
    const isRunning = scan.status === 'in_progress' || scan.status === 'running'

    return (
      <AccordionItem key={scan.task_id} value={scan.task_id} className="border-none bg-transparent">
        <div className={`relative rounded-3xl transition-all border ${
          activeScan?.task_id === scan.task_id
            ? "bg-blue-50/40 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900"
            : "bg-white dark:bg-slate-900 border-border"
        }`}>

          {/* Trigger: question on left, chevron circle on right */}
         <AccordionTrigger hideIcon={true} className="hover:no-underline pl-4 pr-5 pt-3 pb-2 flex items-center gap-3 w-full">
  <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-slate-700 dark:text-slate-200 text-[13px] leading-tight break-words whitespace-normal">
                {scan.question.length > 26 ? scan.question.slice(0, 26) + "..." : scan.question}
              </div>
  </div>

  <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-sm
    transition-colors duration-200
    group-aria-expanded/accordion-trigger:bg-blue-500">
    
    <ChevronDown className="w-4 h-4 transition-transform duration-300 ease-in-out group-aria-expanded/accordion-trigger:rotate-180" />
  </div>
</AccordionTrigger>

          {/* Content */}
          <AccordionContent className="border-none px-4">
            <div className="space-y-1">
              {/* Mode and Delete */}
              <div className="flex flex-col border-t border-slate-100 dark:border-slate-800 pt-2 gap-1.5">
                {isRunning && (
                  <div className="self-start mb-1 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm animate-in fade-in slide-in-from-bottom-1 uppercase">
                    In Progress
                  </div>
                )}
                
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                      <span className="text-sm">⚛️</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {Model_List.find(m => m.Value === scan.model_used)?.Name || "CORE"}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteHistory(scan.task_id)
                    }}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-0 relative pl-1 mt-4">
                {stages.length > 0 ? (
                  <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto scroll-smooth no-scrollbar p-1">
                    <style dangerouslySetInnerHTML={{__html: `
                      .no-scrollbar::-webkit-scrollbar { display: none; }
                      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                      
                      /* Hide all scrollbars within this component's scope */
                      [data-slot="deep-scan-container"] *::-webkit-scrollbar { 
                        display: none !important; 
                      }
                      [data-slot="deep-scan-container"] * { 
                        -ms-overflow-style: none !important; 
                        scrollbar-width: none !important; 
                      }
                    `}} />
                    {stages.map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-3 group">
                        <div className="relative flex flex-col items-center">
                          <div className={`z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            stage.status === 'completed'
                              ? "bg-green-500 text-white"
                              : stage.status === 'in_progress'
                                ? "bg-blue-200 dark:bg-blue-900 animate-pulse"
                                : "bg-slate-200 dark:bg-slate-800"
                          }`}>
                            {stage.status === 'completed' ? (
                              <Check size={10} strokeWidth={4} />
                            ) : (
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                stage.status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-400'
                              }`} />
                            )}
                          </div>
                          {idx !== stages.length - 1 && (
                            <div className={`w-0.5 h-6 -mb-3 ${
                              stage.status === 'completed' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-medium leading-tight truncate ${
                            stage.status === 'completed'
                              ? "text-slate-700 dark:text-slate-300"
                              : stage.status === 'in_progress'
                                ? "text-blue-600 font-bold"
                                : "text-slate-400"
                          }`}>
                            {stage.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    <AutoScrollToBottom />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                      {scan.status === 'completed' ? 'Research Completed' : 'Waiting for system...'}
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  setActiveScan(scan)
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false)
                  }
                }}
                className="w-full mt-2 h-8 text-[11px] font-bold rounded-xl bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-600 transition-all border-none"
              >
                View Detailed Report
              </Button>

            </div>
          </AccordionContent>

        </div>
      </AccordionItem>
    )
  })}
</Accordion>
              ) : (

                <div className="h-full border border-blue-100 dark:border-border rounded-[20px] flex flex-col items-center p-6 text-center mt-2 mx-1 shadow-xs bg-linear-to-b from-transparent to-blue-50/20 dark:to-transparent">
                  <div className="mb-4 mt-8 relative">
                    <div className="relative z-10 w-16 h-16 rounded-full border-[1.5px] border-blue-400 bg-white dark:bg-background flex items-center justify-center shadow-sm">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="w-3 h-[1.5px] bg-blue-400 mt-1 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-5 h-[1.5px] bg-blue-400 rotate-45 rounded-full"></div>
                    </div>
                    {/* decorative sparkles */}
                    <span className="absolute -top-2 -left-3 text-blue-400 text-xs">+</span>
                    <span className="absolute top-2 -right-4 text-blue-400 text-[10px]">+</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-[13px] leading-relaxed mt-4 max-w-[150px]">
                    No Deep Scan <br/> History Has Been Recorded
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-card rounded-2xl md:rounded-[24px] shadow-sm border border-border overflow-hidden relative">
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-50">
            <Button
              variant="secondary"
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-background border border-border shadow-md p-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Open Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
          </div>
        )}

        {!activeScan ? (
          // Landing View
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-3xl flex flex-col items-center text-center mt-6 z-10">
              <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 mb-6">
                <span className="text-3xl lg:text-4xl text-blue-500">✨</span>
              </div>
              <h1 className="text-[32px] md:text-[42px] font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                Stock Market <span className="text-blue-600 dark:text-blue-400">Deep Scan</span>
              </h1>
              <p className="text-[15px] md:text-[16px] text-slate-500 dark:text-slate-400 mb-10 max-w-[680px] leading-relaxed">
                Dig Deeper Into Stock Markets With Forex Brokers List. Get AI-Powered Answers On Equity, Monetary Policy, Market Trends & More. Research Smarter, Invest Better.
              </p>

              {/* Input Area */}
              <div className="w-full max-w-[800px] mb-8">
                <div className="relative flex flex-row items-center flex-wrap md:flex-nowrap p-2 rounded-2xl md:rounded-[20px] border border-blue-400/30 dark:border-border bg-white dark:bg-background shadow-xs transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <input
                    type="text"
                    placeholder="Dig deeper. Win smarter."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 w-full min-w-0 bg-transparent border-0 outline-none px-4 py-3 md:px-5 md:py-4 text-slate-800 dark:text-foreground placeholder:text-slate-400 text-[15px] md:text-base focus:ring-0"
                    onKeyDown={handleKeyPress}
                  />

                  <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-1 md:p-0 mt-1 md:mt-0">
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-auto min-w-[120px] rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-muted/50 h-[44px] shadow-none flex justify-between px-3">
                        <SelectValue placeholder="Mode">
                          <span className="font-bold text-[11px] md:text-xs text-slate-700 dark:text-slate-200 mr-2 uppercase tracking-wide">
                            {Model_List.find(m => m.Value === selectedModel)?.Name || "CORE"}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card border-border shadow-xl rounded-xl">
                        {Model_List.map((model) => (
                          <SelectItem key={model.Value} value={model.Value} className="py-2.5">
                            <span className="font-bold text-xs mr-2">{model.Name}</span>
                            <span className="text-[10px] text-muted-foreground">{model.Duration.replace(' - ', ' - ')}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-[44px] h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0 p-0 shadow-sm transition-transform active:scale-95"
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-[18px] h-[18px] ml-0.5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {Template_INFO.map((template, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(template.Query)
                        handleSend(template.Query)
                      }}
                      className="px-4 py-2 border border-slate-200 dark:border-border bg-white/50 dark:bg-muted/30 hover:bg-slate-50 dark:hover:bg-muted rounded-full text-[13px] font-medium text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <span className="text-yellow-500 text-sm">✨</span> {template.Text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Active Scan View (Playground)
          <div className="flex-1 w-full h-full flex flex-col relative bg-background">
            <div className="p-4 md:p-6 border-b border-border bg-card flex items-start gap-4 h-[100px] md:h-auto">
              <div className="relative w-0 md:w-auto h-full flex items-center">
              </div>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-2 ${!isSidebarOpen ? 'ml-10 ' : ''}`}>
                  <span className="px-2 py-1 text-[10px] font-bold bg-muted text-muted-foreground rounded-md uppercase tracking-wider">
                    {Model_List.find(m => m.Value === activeScan?.model_used)?.Name || "MODEL"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeScan?.created_at ? new Date(activeScan.created_at).toLocaleString() : 'Processing...'}
                  </span>
                  {activeScan && (
                    <span className="px-2 py-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider ml-auto whitespace-nowrap">
                      {activeScan.status}
                    </span>
                  )}
                </div>
                <h2 className={`text-lg md:text-xl font-bold text-foreground leading-snug break-words ${!isSidebarOpen ? 'ml-10' : ''}`}>
                  {activeScan?.question}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full relative no-scrollbar scroll-smooth">
              <ContentPanel
                fullReport={activeScan?.deep_research_answer || activeScan?.answer || null}
                selectedShortReport={activeScan?.answer}
                isLoading={isLoading}
                blogLoading={false}
                scrollToTopSignal={contentPanelScrollKey}
                handleGenerateBlog={() => { }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[400px] p-8 rounded-[32px] border-none shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
            <Trash2 className="w-8 h-8 text-white" />
          </div>

          <DialogHeader className="items-center text-center gap-2 mb-8">
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Delete Deep Scan Record ?
            </DialogTitle>
            <DialogDescription className="text-[15px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Are You Sure You Want To Delete This Deep Scan Record ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold transition-all"
            >
              No
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-200 dark:shadow-none"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MultiTaskProgress 
        tasks={tasks} 
        onCancelTask={cancelTask} 
        onClearTask={clearTask} 
        onClearAllTasks={clearAllTasks} 
      />
    </div>
  )
}

function AutoScrollToBottom() {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  })
  return <div ref={elementRef} />
}
