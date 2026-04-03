"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Send, Loader2, PanelLeftClose, PanelLeft, Plus, Trash2, ChevronUp, Check, MoreVertical } from "lucide-react"
import { Button } from "~/components/common/button"
import { motion, AnimatePresence } from "framer-motion"
import { apiClient, getSignedToken } from "~/lib/api-client"
import { ContentPanel } from "./content-panel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/common/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/common/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"

interface ScanItem {
  task_id: string
  question: string
  model_used: string
  status: string
  created_at: string
  answer?: string
  deep_research_answer?: string
}

interface ProcessingStep {
  id: string
  text: string
  status: 'pending' | 'in_progress' | 'completed'
  progress?: number
}

interface QueryProcessing {
  query: string
  model: string
  steps: ProcessingStep[]
  isExpanded: boolean
}

const DEEP_SCAN_MC_PATH = "/deep-research/v1"

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
  const [history, setHistory] = useState<ScanItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [activeScan, setActiveScan] = useState<ScanItem | null>(null)
  const [currentProcessing, setCurrentProcessing] = useState<QueryProcessing | null>(null)

  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState(Model_List[0].Value)
  const [isLoading, setIsLoading] = useState(false)
  const [contentPanelScrollKey, setContentPanelScrollKey] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scanToDelete, setScanToDelete] = useState<string | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stepsEndRef = useRef<HTMLDivElement>(null)
  const hasAutoResumed = useRef(false)

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  useEffect(() => {
    if (stepsEndRef.current) {
      stepsEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [currentProcessing?.steps])

  const updateProcessingStep = useCallback((message: string, progress?: number) => {
    setCurrentProcessing(prev => {
      if (!prev) return null

      // Update existing step or add new one based on message content
      const updatedSteps = [...prev.steps]

      // Check if this message already exists to avoid duplicates
      const messageExists = updatedSteps.some(step => step.text === message)

      if (!messageExists) {
        // Mark all previous in_progress/pending steps as completed
        for (let i = 0; i < updatedSteps.length; i++) {
          if (updatedSteps[i].status === 'in_progress' || updatedSteps[i].status === 'pending') {
            updatedSteps[i] = { ...updatedSteps[i], status: 'completed' }
          }
        }

        // Add the backend message as a new step
        const newStep: ProcessingStep = {
          id: Date.now().toString(),
          text: message,
          status: 'in_progress',
          progress: progress || undefined
        }
        updatedSteps.push(newStep)
      } else {
        // Update existing step with progress if provided
        const existingStepIndex = updatedSteps.findIndex(step => step.text === message)
        if (existingStepIndex !== -1 && progress !== undefined) {
          updatedSteps[existingStepIndex] = { ...updatedSteps[existingStepIndex], progress }
        }
      }

      return { ...prev, steps: updatedSteps }
    })
  }, [])

  const markStepCompleted = useCallback((_status: string) => {
    setCurrentProcessing(prev => {
      if (!prev) return null

      const updatedSteps = [...prev.steps]

      // Mark the last in-progress step as completed
      for (let i = updatedSteps.length - 1; i >= 0; i--) {
        if (updatedSteps[i].status === 'in_progress') {
          updatedSteps[i] = { ...updatedSteps[i], status: 'completed' }
          break
        }
      }

      return { ...prev, steps: updatedSteps }
    })
  }, [])

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const response = await apiClient.get(`${DEEP_SCAN_MC_PATH}/history?created_by=User&page=1&limit=50`)
      if (response.data?.data?.history) {
        setHistory(response.data.data.history)
      }
    } catch (error) {
      console.error("Failed to fetch history", error)
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  const handleProcessingComplete = useCallback(async (data: any, query: string) => {
    const taskResponse = data.data || data
    const taskId = taskResponse.task_id || data.task_id || (typeof data === 'string' ? data : null)

    if (activeScan?.task_id === taskId && activeScan?.status === 'completed') return

    console.log(`[DeepScan] Handling processing complete for task: ${taskId}`)
    stopPolling()

    if (!taskId) {
      console.error("[DeepScan] Cannot fetch result: No taskId found", data)
      setIsLoading(false)
      return
    }

    updateProcessingStep("Research completed successfully. Finalizing report...", 100)
    markStepCompleted("completed")

    const eventAnswer = taskResponse.answer || taskResponse.Deep_Research_answer || taskResponse.deep_research_answer
    if (eventAnswer) {
      const newScan: ScanItem = {
        task_id: taskId,
        question: query.trim(),
        model_used: selectedModel,
        status: "completed",
        created_at: taskResponse.created_at || new Date().toISOString(),
        answer: eventAnswer,
        deep_research_answer: eventAnswer,
      }
      setCurrentProcessing(null)
      setActiveScan(newScan)
      setHistory(prev => (prev.some(s => s.task_id === taskId) ? prev : [newScan, ...prev]))
      setContentPanelScrollKey(prev => prev + 1)
      setIsLoading(false)
      fetchHistory()
      return
    }

    setIsLoading(true)
    let attempts = 0
    const maxAttempts = 8 // Increased retries

    while (attempts < maxAttempts) {
      try {
        console.log(`[DeepScan] Attempt ${attempts + 1} to fetch final results for task: ${taskId}...`)
        // Increasing wait time
        await new Promise(resolve => setTimeout(resolve, 3000 + attempts * 1000))
        
        const response = await apiClient.get(`${DEEP_SCAN_MC_PATH}/history?created_by=User&page=1&limit=50`)
        const historyList = response.data?.data?.history || response.data?.history || response.data?.data || []
        const result = Array.isArray(historyList) ? historyList.find((s: any) => s.task_id === taskId) : null

        if (result && (result.answer || result.Deep_Research_answer || result.deep_research_answer)) {
          console.log("[DeepScan] Found completed research in history.")
          const finalizedAnswer = result.Deep_Research_answer || result.deep_research_answer || result.answer
          
          const newScan: ScanItem = {
            task_id: taskId,
            question: query.trim(),
            model_used: selectedModel,
            status: "completed",
            created_at: result.created_at || new Date().toISOString(),
            answer: finalizedAnswer,
            deep_research_answer: finalizedAnswer,
          }
          
          setCurrentProcessing(null)
          setActiveScan(newScan)
          setHistory(prev => (prev.some(s => s.task_id === taskId) ? prev : [newScan, ...prev]))
          setContentPanelScrollKey(prev => prev + 1)
          setIsLoading(false)
          fetchHistory() // Sync the sidebar finally
          return
        }
        console.log(`[DeepScan] Task result not ready in history table (attempt ${attempts + 1})...`)
        attempts++
      } catch (e) {
        console.error(`[DeepScan] Error during attempt ${attempts + 1}:`, e)
        attempts++
      }
    }

    console.error(`[DeepScan] Failed to find task ${taskId} results after ${maxAttempts} attempts. State may be inconsistent or backend delayed.`)
    setIsLoading(false)
    // Don't clear currentProcessing yet if it's the only feedback we have, 
    // unless you want the UI to "reset" to landing page.
    // In this case, clearing it reset the landing page, which is what the user dislikes.
    // So let's keep the steps visible or show an error.
    setCurrentProcessing(prev => prev ? { ...prev, isExpanded: true } : null)
  }, [selectedModel, fetchHistory, stopPolling, updateProcessingStep, markStepCompleted, activeScan?.task_id, activeScan?.status])

  const pollTaskStatus = useCallback(async (taskId: string, query: string) => {
    console.log("Starting polling for task:", taskId)

    stopPolling() // Clear any existing poll

    pollIntervalRef.current = setInterval(async () => {
      try {
        console.log(`[DeepScan] Polling status for ${taskId}...`)
        const response = await apiClient.get(`${DEEP_SCAN_MC_PATH}/status?task_id=${taskId}`)
        let rawData = response.data

        // Handle SSE-style "data: " prefix if it's a string
        if (typeof rawData === 'string' && rawData.startsWith('data: ')) {
          try {
            rawData = JSON.parse(rawData.replace(/^data: /, '').trim())
            console.log("[DeepScan] Parsed SSE-style string response")
          } catch (e) {
            console.warn("[DeepScan] Failed to parse string status response", e)
          }
        }

        if (!rawData) {
          console.warn("[DeepScan] No data in status response")
          return
        }

        const taskInfo = rawData.data || rawData
        const status = taskInfo.status || rawData.type

        console.log("[DeepScan] Polling update:", { status, message: taskInfo.message, progress: taskInfo.progress })

        // Update the processing steps
        if (taskInfo.message) {
          updateProcessingStep(taskInfo.message, taskInfo.progress)
        }

        // If task is completed, handle total completion
        if (status === 'completed' || status === 'success' || rawData.type === 'research.completed') {
          console.log("[DeepScan] Task COMPLETED via polling:", taskId)
          stopPolling()
          handleProcessingComplete(rawData, query)
        } else if (status === 'failed' || status === 'error') {
          console.error("[DeepScan] Task FAILED via polling:", taskId)
          stopPolling()
          setIsLoading(false)
          setCurrentProcessing(null)
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log("[DeepScan] Task no longer available at status endpoint (likely completed). Finalizing...")
          stopPolling()
          handleProcessingComplete({ task_id: taskId }, query)
        } else {
          console.error("[DeepScan] Polling request error:", error)
        }
      }
    }, 3000)
  }, [stopPolling, updateProcessingStep, handleProcessingComplete])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  useEffect(() => {
    if (!hasAutoResumed.current && history.length > 0) {
      const activeTask = history.find(s => s.status === 'in_progress' || s.status === 'pending')
      if (activeTask && !currentProcessing && !activeScan) {
        console.log("[DeepScan] Auto-resuming active task on load:", activeTask.task_id)
        hasAutoResumed.current = true
        setCurrentProcessing({
          query: activeTask.question,
          model: activeTask.model_used || "CORE",
          steps: [{ id: "1", text: "Reconnecting to live progress...", status: "in_progress" }],
          isExpanded: true
        })
        setActiveScan(null)
        setIsLoading(true)
        pollTaskStatus(activeTask.task_id, activeTask.question)
      } else if (!activeTask) {
        hasAutoResumed.current = true
      }
    }
  }, [history, currentProcessing, activeScan, pollTaskStatus])

  const handleDeleteHistory = (taskId: string) => {
    setScanToDelete(taskId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!scanToDelete) return

    console.log("[DeepScan] Confirming deletion of:", scanToDelete)
    try {
      const response = await apiClient.delete(`${DEEP_SCAN_MC_PATH}/history?task_id=${scanToDelete}`)
      if (response.data?.success || response.status === 200) {
        setHistory(prev => prev.filter(item => item.task_id !== scanToDelete))
        if (activeScan?.task_id === scanToDelete) {
          setActiveScan(null)
        }
      }
    } catch (error) {
      console.error("[DeepScan] Failed to delete history item", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setScanToDelete(null)
    }
  }

  const handleSend = async (queryOverride?: string) => {
    const query = queryOverride || inputValue
    console.log("[DeepScan] handleSend started. Query:", query)
    if (!query.trim() || isLoading) {
      console.log("[DeepScan] handleSend aborted. Empty query or already loading.")
      return
    }

    setIsLoading(true)
    setInputValue("")

    // Initialize processing state
    initializeProcessing(query, selectedModel)

    try {
      const payload = {
        query: query.trim(),
        model: selectedModel,
        created_by: "User",
        use_async: true,
      }

      // Use native fetch to handle streaming response (Axios buffers)
      console.log("[DeepScan] (Stream Call) Initiating fetch with streaming reader...")
      const apiKey = await getSignedToken()
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const fullUrl = `${baseUrl}${DEEP_SCAN_MC_PATH}/query-stream`

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': apiKey,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      // Initializing reader for stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error("ReadableStream not supported")

      const decoder = new TextDecoder()
      let partialData = ""

      // Read chunks as they arrive
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        partialData += chunk

        // Process lines in the chunk (SSE format: "data: { ... }")
        const lines = partialData.split("\n")
        partialData = lines.pop() || "" // Keep the last partial line

        for (const line of lines) {
          if (!line.trim().startsWith("data: ")) continue

          try {
            const dataStr = line.replace(/^data: /, "").trim()
            const data = JSON.parse(dataStr)
            console.log("[DeepScan] Stream Data Item:", data)

            // Handle the response data for processing
            const taskData = data.data || data
            const type = data.type || taskData.type
            const taskId = taskData.task_id || data.task_id
            const status = taskData.status || type

            if (type === 'research.task_submitted' || taskId) {
              const message = taskData.message || "Task submitted successfully"
              const progress = taskData.progress || 0
              updateProcessingStep(message, progress)

              if (taskId) {
                console.log("[DeepScan] (Stream) taskId found, starting status polling as backup...")
                pollTaskStatus(taskId, query)
              }
            } else if (type === 'research.status' || type === 'enhancement.status') {
              console.log("[DeepScan] (Stream) Status update:", taskData.message)
              updateProcessingStep(taskData.message, taskData.progress)

              if (taskData.status && taskData.status !== 'queued') {
                markStepCompleted(taskData.status)
              }

              if (status === 'completed' || status === 'success' || type === 'research.completed') {
                console.log("[DeepScan] (Stream) Task COMPLETED signal received")
                handleProcessingComplete(data, query)
                return
              }
            }
          } catch (e) {
            console.warn("[DeepScan] Error parsing stream chunk line:", e)
          }
        }
      }
      
    } catch (error) {
      console.error("Error calling API:", error)
      setCurrentProcessing(null)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startNewScan = () => {
    stopPolling()
    setActiveScan(null)
    setInputValue("")
    setCurrentProcessing(null)
  }

  const initializeProcessing = (query: string, model: string) => {
    const steps: ProcessingStep[] = [
      { id: "1", text: "Initializing deep scan...", status: "pending" },
      { id: "2", text: "Waiting for backend response...", status: "pending" },
    ]

    setCurrentProcessing({
      query,
      model,
      steps,
      isExpanded: true,
    })
  }

  return (
    <div className="flex-1 w-full flex bg-[#eef2f6] dark:bg-background p-2 md:p-4 gap-4 overflow-hidden relative min-h-[calc(100vh-80px-var(--header-height))] max-h-[calc(100vh-80px-var(--header-height))]">
      {/* Left Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginLeft: -16 }}
            animate={{ width: 300, opacity: 1, marginLeft: 0 }}
            exit={{ width: 0, opacity: 0, marginLeft: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0 flex flex-col bg-white dark:bg-card rounded-2xl md:rounded-[24px] shadow-sm border border-border overflow-hidden whitespace-nowrap"
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
                className="w-[42px] h-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm p-0 flex items-center justify-center shrink-0 transition-colors"
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

            <div className="flex-1 p-3 lg:p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-sm">Loading history...</span>
                </div>
              ) : history.length > 0 || currentProcessing ? (
                <div className="flex flex-col gap-2">
                  {/* Processing History Accordion */}
                  {currentProcessing && (
                    <Accordion 
                      type="single" 
                      collapsible
                      value={currentProcessing.isExpanded ? "processing" : ""}
                      onValueChange={(val) => setCurrentProcessing(prev => prev ? { ...prev, isExpanded: !!val } : null)} 
                      className="w-full shrink-0"
                    >
                      <AccordionItem value="processing" className="border border-border rounded-xl bg-white dark:bg-card shadow-sm">
                        <AccordionTrigger className="px-3 py-2 hover:no-underline [&>svg]:w-4 [&>svg]:h-4">
                          <div className="flex items-center gap-2 overflow-hidden w-full">
                            <span className="text-xs font-medium text-foreground truncate flex-1" title={currentProcessing.query}>
                              {currentProcessing.query?.length > 26 ? currentProcessing.query.substring(0, 26) + "..." : currentProcessing.query}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Research Model:</span>
                            <span className="px-1.5 py-0.5 text-[8px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">
                              {Model_List.find(m => m.Value === currentProcessing.model)?.Name || "CORE"}
                            </span>
                          </div>
                          <div 
                            className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            <style dangerouslySetInnerHTML={{__html: `
                              .no-scrollbar::-webkit-scrollbar { display: none; }
                            `}} />
                            <div className="no-scrollbar space-y-2">
                              {currentProcessing.steps.map((step) => (
                                <div key={step.id} className="flex items-center gap-2">
                                  <div className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    step.status === 'completed' ? 'border-white/20' : 
                                    step.status === 'in_progress' ? 'border-blue-600/50' : 
                                    'border-border'
                                  }`}>
                                    {step.status === 'completed' ? (
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    ) : step.status === 'in_progress' ? (
                                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                    )}
                                  </div>
                                  <span className={`text-[11px] transition-colors ${
                                    step.status === 'completed' ? 'text-white font-normal' : 
                                    step.status === 'in_progress' ? 'text-blue-600 font-medium' : 
                                    'text-muted-foreground/40'
                                  }`}>
                                    {step.text}
                                  </span>
                                </div>
                              ))}
                              <div ref={stepsEndRef} />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {history.map((scan) => (
                    <div
                      key={scan.task_id}
                      className={`relative group w-full p-0 rounded-xl border transition-all text-sm overflow-hidden ${activeScan?.task_id === scan.task_id
                        ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-transparent border-transparent hover:bg-muted"
                        }`}
                    >
                      <button
                        onClick={() => {
                          stopPolling()
                          if (scan.status === 'in_progress' || scan.status === 'pending') {
                            setCurrentProcessing({
                              query: scan.question,
                              model: scan.model_used || "CORE",
                              steps: [{ id: "1", text: "Reconnecting to live progress...", status: "in_progress" }],
                              isExpanded: true
                            })
                            setActiveScan(null)
                            setIsLoading(true)
                            pollTaskStatus(scan.task_id, scan.question)
                          } else {
                            setActiveScan(scan)
                            setCurrentProcessing(null)
                            setIsLoading(false)
                          }
                        }}
                        className="w-full text-left p-3 pr-10"
                      >
                        <div className="font-medium text-foreground truncate mb-1" title={scan.question}>
                          {scan.question?.length > 26 ? scan.question.substring(0, 26) + "..." : scan.question}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                          {scan.status.replace("_", " ")}
                        </div>
                      </button>

                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-card border-border shadow-xl">
                            <DropdownMenuItem
                              onClick={() => handleDeleteHistory(scan.task_id)}
                              className="text-red-500 focus:text-red-500 flex items-center gap-2 py-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Scan</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-[13px] leading-relaxed mt-4 text-center mx-auto max-w-[200px] uppercase tracking-tight">
                    No Deep Scan History<br /> Has Been Recorded
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-card rounded-2xl md:rounded-[24px] shadow-sm border border-border overflow-hidden relative">
        <div className="absolute top-4 left-4 z-20">
          {!isSidebarOpen && (
            <Button
              variant="secondary"
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-background border-border shadow-xs p-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Open Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
          )}
        </div>

        {!activeScan && !currentProcessing ? (
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
                <div className="relative flex flex-col md:flex-row items-center p-2 rounded-2xl md:rounded-[20px] border border-blue-400/30 dark:border-border bg-white dark:bg-background shadow-xs transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <input
                    type="text"
                    placeholder="Dig deeper. Win smarter."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 w-full min-w-0 bg-transparent border-0 outline-none px-4 py-3 md:px-5 md:py-4 text-slate-800 dark:text-foreground placeholder:text-slate-400 text-[15px] md:text-base focus:ring-0"
                    onKeyDown={handleKeyPress}
                  />

                  <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:p-0 border-t border-border mt-2 pt-2 md:border-0 md:mt-0">
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
                      disabled={!inputValue.trim() || isLoading}
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
            <div className="p-5 md:p-6 border-b border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 text-[10px] font-bold bg-muted text-muted-foreground rounded-md uppercase tracking-wider">
                  {Model_List.find(m => m.Value === (activeScan?.model_used || currentProcessing?.model))?.Name || "MODEL"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {activeScan?.created_at ? new Date(activeScan.created_at).toLocaleString() : 'Processing...'}
                </span>
                {activeScan && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider ml-auto">
                    {activeScan.status.replace("_", " ")}
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                {activeScan?.question || currentProcessing?.query}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto w-full relative">
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
    </div>
  )
}
