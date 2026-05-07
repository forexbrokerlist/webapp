"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Send, Loader2, PanelLeftClose, PanelLeft, Plus, Trash2, ChevronDown, Check, Calendar, Building2, MonitorPlay, TrendingUp, Binoculars, Car, Pill, ArrowLeftRight } from "lucide-react"
import { Button } from "~/components/common/button"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "~/lib/auth-client"
import { useRouter } from "next/navigation"
import { apiClient } from "~/lib/api-client"
import { ContentPanel } from "./content-panel"
import { useStreamingTask } from "~/hooks/useStreamingTask"
import { MultiTaskProgress } from "./multi-task-progress"
const FxguruIcon = '/assets/images/fxguru.svg';

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
import CommonBanner from "../common-banner"
const TradeImage = '/assets/images/deep-scan.png';

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
  { Text: "RBI Policy", Query: "What is the impact of the latest RBI policy?", Icon: Calendar },
  { Text: "Bank Sector", Query: "Analysis of the banking sector performance.", Icon: Building2 },
  { Text: "IT Stock", Query: "What are the top IT stocks to watch?", Icon: MonitorPlay },
  { Text: "Market Trend", Query: "Current trends in the stock market.", Icon: TrendingUp },
  { Text: "Tech Sector", Query: "Outlook for the technology sector.", Icon: Binoculars },
  { Text: "Auto Sector", Query: "Recent developments in the automotive industry.", Icon: Car },
  { Text: "Pharma Sector", Query: "Analysis of the pharmaceutical sector.", Icon: Pill },
  { Text: "Forex Market", Query: "Latest updates on the forex market.", Icon: ArrowLeftRight },
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
  }, [pollTask, userId])

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
      ; (async () => {
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
    <div data-slot="deep-scan-container" className="">

      <CommonBanner
        image={TradeImage}
        description='Explore equities, market trends, and monetary policies with AI-driven analysis—helping you make smarter research decisions and better investments.'
        highlightedText="Deep Scan –" title="AI-Powered Stock Research & Market Intelligence" />


      <div className="pb-100 max-tab:hidden">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="grid grid-cols-[390px_1fr] gap-5">
            <div className="bg-white rounded-xl border border-solid border-border-light300">

              <div className="p-3 ">
                <Button variant="secondary" className="py-2 text-base w-full" onClick={startNewScan}>
                  <div className="flex items-center  gap-2">
                    <Plus className="h-4 w-4" />
                  </div>
                  New Scan
                </Button>
                <div className="flex items-center gap-3 my-3 px-2">
                  <div className="h-[1.5px] flex-1 bg-primary"></div>
                  <span className="text-sm font-medium text-black700 whitespace-nowrap">My Scans</span>
                  <div className="h-[1.5px] flex-1 bg-primary"></div>
                </div>
              </div>

              <div className="flex-1 px-3 pb-3 overflow-y-auto no-scrollbar scroll-smooth h-[calc(100%-110px)] overflow-auto">
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
                          <div className={`relative rounded-xl transition-all border  ${activeScan?.task_id === scan.task_id
                            ? "bg-[#F0F1EC] border-blue-200 dark:bg-blue-900/10 dark:border-blue-900"
                            : "bg-[#F0F1EC] border-border"
                            }`}>

                            {/* Trigger: question on left, chevron circle on right */}
                            <AccordionTrigger hideIcon={true} className="hover:no-underline  flex items-center gap-2 w-full">
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium text-slate-700 dark:text-slate-200 text-[13px] leading-tight break-words whitespace-normal">
                                  {scan.question.length > 26 ? scan.question.slice(0, 26) + "..." : scan.question}
                                </div>
                              </div>

                              <div className="relative cursor-pointer shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black shadow-sm
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
                                      <style dangerouslySetInnerHTML={{
                                        __html: `
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
                                            <div className={`z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${stage.status === 'completed'
                                              ? "bg-green-500 text-white"
                                              : stage.status === 'in_progress'
                                                ? "bg-blue-200 dark:bg-blue-900 animate-pulse"
                                                : "bg-slate-200 dark:bg-slate-800"
                                              }`}>
                                              {stage.status === 'completed' ? (
                                                <Check size={10} strokeWidth={4} />
                                              ) : (
                                                <div className={`w-1.5 h-1.5 rounded-full ${stage.status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-400'
                                                  }`} />
                                              )}
                                            </div>
                                            {idx !== stages.length - 1 && (
                                              <div className={`w-0.5 h-6 -mb-3 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'
                                                }`} />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-[11px] font-medium leading-tight truncate ${stage.status === 'completed'
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
                      No Deep Scan <br /> History Has Been Recorded
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl px-4 py-[60px]">


              {!activeScan ? (

                <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-3 lg:p-8">

                  <div className="max-w-[980px] mx-auto">
                    <div className="pb-10">
                      <div className="flex justify-center">
                        <img src={FxguruIcon} alt="FxguruIcon" className="block" />
                      </div>
                      <h2 className="text-3xl text-black font-bold text-center mb-3">
                        Stock Market Deep Scan
                      </h2>
                      <p className="text-lg font-medium text-black700 max-w-[733px] mx-auto text-center">
                        Dig Deeper Into Stock Markets With Forex Brokers List. Get AI-Powered Answers On Equity,
                        Monetary Policy, Market Trends & More. Research Smarter, Invest Better.
                      </p>
                    </div>
                    <div className="w-full max-w-[850px] mb-8">
                      <div className="relative flex flex-col p-4 rounded-3xl border-1 border-primary bg-white shadow-sm transition-all focus-within:shadow-md">
                        <textarea
                          placeholder="Dig deeper. Win smarter."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                          className="w-full bg-transparent border-0 outline-none px-4 py-2 text-black placeholder:text-slate-400 text-lg focus:ring-0 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
                          onKeyDown={handleKeyPress}
                        />

                        <div className="flex items-center justify-end gap-3 px-2 mt-2">
                          <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="w-auto h-10 px-6 rounded-full border border-slate-200 bg-white text-black font-bold text-xs uppercase tracking-wider shadow-none flex justify-between gap-3">
                              <SelectValue placeholder="Mode">
                                {Model_List.find(m => m.Value === selectedModel)?.Name || "CORE"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-xl rounded-xl">
                              {Model_List.map((model) => (
                                <SelectItem key={model.Value} value={model.Value} className="py-2.5">
                                  <span className="font-bold text-xs mr-2">{model.Name}</span>
                                  <span className="text-[10px] text-muted-foreground">{model.Duration}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 p-0 shadow-sm transition-all active:scale-95"
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

                      <div className="flex flex-wrap justify-center gap-3 mt-6">
                        {Template_INFO.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInputValue(template.Query)
                              handleSend(template.Query)
                            }}
                            className="px-5 py-2.5 bg-[#F0F1EC99] hover:bg-[#EBECE7] rounded-full text-[14px] font-medium text-black transition-all flex items-center gap-2 shadow-xs"
                          >
                            {template.Icon && <template.Icon className="w-4 h-4 text-black/70" />}
                            {template.Text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>


                </div>
              ) : (
                // Active Scan View (Playground)
                <div className="flex-1 h-[calc(100%-110px)] overflow-y-auto p-3 pt-0 space-y-3">
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
          </div>
        </div>
      </div>

      {/* Mobile / Tablet — Desktop-only notice */}
      <div className="hidden max-tab:flex flex-col items-center justify-center px-5 py-16 text-center">
        <motion.div
          className="relative w-full max-w-sm mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-primary/10 to-blue-50 rounded-[32px] blur-2xl opacity-60 pointer-events-none" />

          <div className="relative bg-white border border-blue-100 rounded-xl shadow-xl shadow-blue-100/40 p-8 flex flex-col items-center gap-5 overflow-hidden">
            {/* Animated floating dots */}
            <motion.div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary/40"
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute top-8 right-6 w-1.5 h-1.5 rounded-full bg-blue-400/50"
              animate={{ y: [0, -6, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
            <motion.div className="absolute bottom-6 left-8 w-1.5 h-1.5 rounded-full bg-blue-300/40"
              animate={{ y: [0, -5, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />

            {/* Pulsing monitor icon */}
            <motion.div
              className="w-20 h-20 rounded-full bg-[#A8DD15] flex items-center justify-center shadow-lg shadow-blue-300/50"
              animate={{ scale: [1, 1.06, 1], boxShadow: ["0 10px 30px rgba(59,130,246,0.3)", "0 14px 40px rgba(59,130,246,0.55)", "0 10px 30px rgba(59,130,246,0.3)"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-10 h-10 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 leading-snug">
                Desktop View Required
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                This tool is optimized for a larger screen. Please open it on a <span className="font-semibold text-blue-600">desktop or laptop</span> for the best experience.
              </p>
            </div>

            {/* Animated divider */}
            <motion.div
              className="h-[2px] w-16 rounded-full bg-gradient-to-r from-blue-400 to-primary"
              animate={{ width: ["40px", "80px", "40px"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-600 shadow-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Open on Desktop to Continue
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[400px] max-tab:hidden p-8 rounded-[32px] border-none shadow-2xl flex flex-col items-center text-center">
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
