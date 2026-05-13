"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Send, Loader2, PanelLeftClose, PanelLeft, Plus, Trash2, ChevronDown, Check, Calendar, Building2, MonitorPlay, TrendingUp, Binoculars, Car, Pill, ArrowLeftRight, MessageSquare } from "lucide-react"
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
    if (window.innerWidth < 1024) {
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

  const sidebarContent = (
    <div className="flex flex-col h-full lg:max-h-[700px]">
      <div className="p-4">
        <Button
          variant="primary"
          className="text-base w-full"
          onClick={startNewScan}
        >
          <div className="flex items-center">
            <Plus className="h-5 w-5" />
          </div>
          <span>New Scan</span>
        </Button>
        <div className="flex items-center gap-3 my-5 px-1">
          <div className="h-[1px] flex-1 bg-border"></div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">My Scans</span>
          <div className="h-[1px] flex-1 bg-border"></div>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4 overflow-y-auto no-scrollbar scroll-smooth">
        {historyLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Loading history...</span>
          </div>
        ) : displayedScans.length > 0 ? (
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {displayedScans.map((scan) => {
              const task = tasks[scan.task_id] || Object.values(tasks).find(t => t.task_id === scan.task_id)
              const stages = task?.stages || []
              const isRunning = scan.status === 'in_progress' || scan.status === 'running'

              return (
                <AccordionItem key={scan.task_id} value={scan.task_id} className="border-none bg-transparent">
                  <div className={`relative rounded-xl transition-all border ${activeScan?.task_id === scan.task_id
                    ? "bg-[#F0F1EC] border-blue-200 dark:bg-blue-900/10 dark:border-blue-900"
                    : "bg-[#F0F1EC] border-border"
                    }`}>
                    <AccordionTrigger hideIcon={true} className="hover:no-underline flex items-center gap-2 w-full p-3">
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-[13px] leading-tight break-words whitespace-normal">
                          {scan.question.length > 30 ? scan.question.slice(0, 30) + "..." : scan.question}
                        </div>
                      </div>
                      <div className="relative cursor-pointer shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border text-black shadow-xs transition-colors duration-200">
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 ease-in-out group-aria-expanded/accordion-trigger:rotate-180" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-none px-4 pb-4">
                      <div className="space-y-1">
                        <div className="flex flex-col border-t border-border pt-3 gap-2">
                          {isRunning && (
                            <div className="self-start mb-1 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                              In Progress
                            </div>
                          )}
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 text-blue-600">
                              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
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
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-0 relative pl-1 mt-4">
                          {stages.length > 0 ? (
                            <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto no-scrollbar">
                              {stages.map((stage, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="relative flex flex-col items-center">
                                    <div className={`z-10 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${stage.status === 'completed'
                                      ? "bg-green-500 text-white"
                                      : stage.status === 'in_progress'
                                        ? "bg-blue-400 animate-pulse"
                                        : "bg-slate-200"
                                      }`}>
                                      {stage.status === 'completed' ? (
                                        <Check size={9} strokeWidth={4} />
                                      ) : (
                                        <div className={`w-1.5 h-1.5 rounded-full ${stage.status === 'in_progress' ? 'bg-white' : 'bg-slate-400'}`} />
                                      )}
                                    </div>
                                    {idx !== stages.length - 1 && (
                                      <div className={`w-0.5 h-6 -mb-3 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'}`} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-semibold leading-tight truncate ${stage.status === 'completed' ? "text-slate-600" : stage.status === 'in_progress' ? "text-blue-600" : "text-slate-400"}`}>
                                      {stage.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                <Check size={9} strokeWidth={4} />
                              </div>
                              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                                {scan.status === 'completed' ? 'Research Completed' : 'Pending...'}
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            setActiveScan(scan)
                            if (window.innerWidth < 1024) {
                              setIsSidebarOpen(false)
                            }
                          }}
                          className="w-full mt-4 h-9 text-[11px] font-bold rounded-xl bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-600 transition-all border-none"
                        >
                          View Report
                        </Button>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-3" />
            <p className="text-xs text-muted-foreground font-semibold">No recent scans found.</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div data-slot="deep-scan-container" className="">
      <CommonBanner
        image={TradeImage}
        description='Explore equities, market trends, and monetary policies with AI-driven analysis—helping you make smarter research decisions and better investments.'
        highlightedText="Deep Scan –" title="AI-Powered Stock Research & Market Intelligence" />

      <div className="pb-12 sm:pb-24">
        <div className="max-w-[1640px] px-4 sm:px-10 lg:px-16 mx-auto relative">

          {/* Mobile sidebar toggle */}
          <div className="lg:hidden flex items-center gap-3 pt-6 mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-light300 rounded-full shadow-sm text-sm font-semibold text-black700 hover:bg-muted transition-all active:scale-95"
            >
              <Binoculars className="w-4 h-4" />
              My Scans
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[390px_1fr] gap-6">

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl border border-solid border-border-light300 shadow-sm h-fit sticky top-24 overflow-hidden">
              {sidebarContent}
            </div>

            {/* Sidebar - Mobile Drawer */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                  />
                  <motion.div
                    className="fixed top-0 left-0 h-full w-[300px] sm:w-[340px] z-50 lg:hidden p-4"
                    initial={{ x: -340 }}
                    animate={{ x: 0 }}
                    exit={{ x: -340 }}
                    transition={{ type: "tween", duration: 0.3 }}
                  >
                    <div className="bg-white rounded-2xl border border-solid border-border-light300 h-full flex flex-col shadow-xl overflow-hidden">
                      <div className="p-4 flex justify-end">
                        <button
                          onClick={() => setIsSidebarOpen(false)}
                          className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:bg-muted transition-all active:scale-90"
                        >
                          <Plus className="w-5 h-5 text-black/60 rotate-45" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {sidebarContent}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-2xl border border-border-light300 px-4 sm:px-8 py-10 sm:py-[60px] shadow-sm overflow-hidden min-h-[500px]">
              {!activeScan ? (
                <div className="flex-1 w-full h-full flex flex-col items-center justify-center py-4 sm:py-8">
                  <div className="max-w-[980px] w-full mx-auto">
                    <div className="pb-8 sm:pb-12 text-center">
                      <div className="flex justify-center mb-6">
                        <img src={FxguruIcon} alt="FxguruIcon" className="w-14 sm:w-20 md:w-auto h-auto" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold mb-4 leading-tight">
                        Stock Market Deep Scan
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-black700 max-w-[733px] mx-auto leading-relaxed">
                        Dig Deeper Into Stock Markets With Forex Brokers List. Get AI-Powered Answers On Equity,
                        Monetary Policy, Market Trends & More. Research Smarter, Invest Better.
                      </p>
                    </div>

                    <div className="w-full max-w-[850px] mx-auto mb-8">
                      <div className="relative flex flex-col p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-primary bg-white shadow-md transition-all focus-within:shadow-lg focus-within:shadow-primary/10">
                        <textarea
                          placeholder="Dig deeper. Win smarter."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                          className="w-full bg-transparent border-0 outline-none px-2 sm:px-4 py-2 text-black placeholder:text-slate-400 text-base sm:text-lg focus:ring-0 resize-none min-h-[60px] sm:min-h-[80px] max-h-[200px] overflow-y-auto"
                          onKeyDown={handleKeyPress}
                        />

                        <div className="flex items-center justify-end gap-3 px-2 mt-4 sm:mt-2">
                          <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="w-auto h-9 sm:h-10 px-4 sm:px-6 rounded-full border border-slate-200 bg-white text-black font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-none flex justify-between gap-2 sm:gap-3">
                              <SelectValue placeholder="Mode">
                                {Model_List.find(m => m.Value === selectedModel)?.Name || "CORE"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-xl rounded-xl">
                              {Model_List.map((model) => (
                                <SelectItem key={model.Value} value={model.Value} className="py-2 sm:py-2.5">
                                  <span className="font-bold text-[10px] sm:text-xs mr-2">{model.Name}</span>
                                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">{model.Duration}</span>
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

                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
                        {Template_INFO.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInputValue(template.Query)
                              handleSend(template.Query)
                            }}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-muted/40 hover:bg-muted/70 rounded-full text-xs sm:text-[14px] font-semibold text-black700 transition-all flex items-center gap-2 shadow-xs border border-transparent hover:border-border"
                          >
                            {template.Icon && <template.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/60" />}
                            {template.Text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 h-full overflow-hidden flex flex-col">
                  <div className="p-4 sm:p-6 border-b border-border bg-card flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-2">
                        <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-muted text-muted-foreground rounded-md uppercase tracking-wider">
                          {Model_List.find(m => m.Value === activeScan?.model_used)?.Name || "MODEL"}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                          {activeScan?.created_at ? new Date(activeScan.created_at).toLocaleString() : 'Processing...'}
                        </span>
                        {activeScan && (
                          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider ml-auto whitespace-nowrap">
                            {activeScan.status}
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-xl font-bold text-foreground leading-snug break-words">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[400px] p-8 rounded-[32px] border-none shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <Trash2 className="w-8 h-8 text-white" />
          </div>

          <DialogHeader className="items-center text-center gap-2 mb-8">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Delete Deep Scan Record?
            </DialogTitle>
            <DialogDescription className="text-[15px] text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete this deep scan record?
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold transition-all"
            >
              No
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
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
