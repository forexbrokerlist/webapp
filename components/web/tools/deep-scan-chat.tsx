"use client"

import { useState, useEffect, useCallback } from "react"
import { Send, Loader2, FileText, ChevronDown, PanelLeftClose, PanelLeft, Plus, Search } from "lucide-react"
import { Button } from "~/components/common/button"
import { motion, AnimatePresence } from "framer-motion"
import { apiClient } from "~/lib/api-client"
import { ContentPanel } from "./content-panel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"

interface ScanItem {
  task_id: string
  question: string
  model_used: string
  status: string
  created_at: string
  answer?: string
  deep_research_answer?: string
}

const DEEP_SCAN_MC_PATH = "/deep-research/deep-research/v1"

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
  
  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState(Model_List[0].Value)
  const [isLoading, setIsLoading] = useState(false)
  const [contentPanelScrollKey, setContentPanelScrollKey] = useState(0)

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

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleSend = async (queryOverride?: string) => {
    const query = queryOverride || inputValue
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    setInputValue("")

    try {
      const payload = {
        query: query.trim(),
        model: selectedModel,
        created_by: "User",
        use_async: true,
      }

      const response = await apiClient.post(`${DEEP_SCAN_MC_PATH}/scan`, payload)
      const data = response.data

      if (data.success || data.status === "success" || data.data) {
        const resultData = data.data || data
        // Deep Scan usually streams. Assuming mock response immediately for the UI implementation as per earlier guidelines.
        const newScan: ScanItem = {
          task_id: resultData.task_id || Date.now().toString(),
          question: query.trim(),
          model_used: selectedModel,
          status: "completed",
          created_at: new Date().toISOString(),
          answer: resultData.answer || resultData.response?.short_response || "Deep Scan initiated.",
          deep_research_answer: resultData.Deep_Research_answer || resultData.full_report || resultData.answer || "Mocked comprehensive deep scan report text.",
        }
        
        setActiveScan(newScan)
        setHistory(prev => [newScan, ...prev])
        setContentPanelScrollKey(prev => prev + 1)
      }
    } catch (error) {
      console.error("Error calling API:", error)
    } finally {
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
    setActiveScan(null)
    setInputValue("")
  }

  return (
    <div className="flex-1 w-full flex bg-[#eef2f6] dark:bg-background p-2 md:p-4 gap-4 overflow-hidden relative min-h-[calc(100vh-174px-var(--header-height))]">
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
                <Plus className="w-4 h-4 mr-2" /> New Scan
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
            
            <div className="flex-1 p-3 lg:p-4 overflow-y-auto">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-sm">Loading history...</span>
                </div>
              ) : history.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {history.map((scan) => (
                    <button
                      key={scan.task_id}
                      onClick={() => setActiveScan(scan)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm truncate ${
                        activeScan?.task_id === scan.task_id 
                          ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                          : "bg-transparent border-transparent hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium text-foreground truncate mb-1">{scan.question}</div>
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                        {scan.status.replace("_", " ")}
                      </div>
                    </button>
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
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-[13px] leading-relaxed mt-4 max-w-[150px]">
                    No Deep Scan History Has Been Recorded
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
                     {Model_List.find(m => m.Value === activeScan.model_used)?.Name || "MODEL"}
                   </span>
                   <span className="text-[11px] text-muted-foreground">
                     {new Date(activeScan.created_at).toLocaleString()}
                   </span>
                   <span className="px-2 py-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider ml-auto">
                     {activeScan.status.replace("_", " ")}
                   </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                  {activeScan.question}
                </h2>
             </div>
             
             <div className="flex-1 overflow-y-auto w-full relative">
                <ContentPanel
                  fullReport={activeScan.deep_research_answer || activeScan.answer || null}
                  selectedShortReport={activeScan.answer}
                  isLoading={false}
                  blogLoading={false}
                  scrollToTopSignal={contentPanelScrollKey}
                  handleGenerateBlog={() => {}}
                />
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
