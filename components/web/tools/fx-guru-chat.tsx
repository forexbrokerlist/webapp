"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, FileText, User, Image as ImageIcon, X, ArrowLeft, MessageSquare, Plus, TrendingUp, Layers, Zap, Shield, Target, Activity, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/common/button"
import { Avatar, AvatarFallback } from "~/components/common/avatar"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { apiClient } from "~/lib/api-client"
import { Card } from "~/components/common/card"
import { Stack } from "~/components/common/stack"
import { useSession } from "~/lib/auth-client"
import { saveFxGuruConversation, getFxGuruConversations } from "~/server/web/actions/fx-guru"
import CommonBanner from "../common-banner"
const TradeImage = '/assets/images/trade.png';

interface Message {
  id: string
  content: any
  sender: "user" | "assistant"
  timestamp: string
  type: "text" | "image"
  short_response?: any
  full_report?: any
  image_url?: string
}

const STOCK_GURU_MC_PATH = "/stock-guru/api/v1"

// ─────────────────────────────────────────────────────────
// Shared API + formatting helpers
// ─────────────────────────────────────────────────────────

const renderSection = (title: string, content: any) => ({ title, content })

const formatToIST = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("en-IN", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

const formatResponseContent = (response: any): any => {
  if (typeof response === "string") {
    try {
      const cleanJson = response.replace(/^```json\n?|\n?```$/g, "").trim()

      // Robust JSON repair for truncated strings
      const repairJson = (str: string) => {
        let repaired = str;
        // Close an open string if it ends abruptly
        const lastQuoteIndex = repaired.lastIndexOf('"');
        const lastColonIndex = repaired.lastIndexOf(':');
        if (lastQuoteIndex < lastColonIndex || (lastQuoteIndex > -1 && repaired.split('"').length % 2 === 0)) {
          repaired += '"';
        }

        // Count brackets and close them
        const stack: string[] = [];
        for (let char of repaired) {
          if (char === '{') stack.push('}');
          else if (char === '[') stack.push(']');
          else if (char === '}' || char === ']') {
            if (stack.length > 0 && stack[stack.length - 1] === char) stack.pop();
          }
        }
        while (stack.length > 0) repaired += stack.pop();
        return repaired;
      }

      try {
        return formatResponseContent(JSON.parse(cleanJson))
      } catch (e) {
        try {
          return formatResponseContent(JSON.parse(repairJson(cleanJson)))
        } catch {
          return response
        }
      }
    } catch (e) {
      return response
    }
  }

  if (typeof response !== "object" || response === null) return response

  const sections: any[] = []
  if (response.overall_summary) sections.push(renderSection("Overall Summary", response.overall_summary))
  if (response.overall_trend) sections.push({ type: "trend", title: "Market Analysis", content: response.overall_trend })
  if (response.market_structure) sections.push({ type: "structure", title: "Market Structure", content: response.market_structure })
  if (response.supply_and_demand_zones) sections.push({ type: "zones", title: "Supply & Demand", content: response.supply_and_demand_zones })
  if (response.support_and_resistance) sections.push({ type: "levels", title: "Support & Resistance", content: response.support_and_resistance })

  if (sections.length === 0 && !response.overall_summary) {
    sections.push(renderSection("Analysis Details", response))
  }
  return sections
}

const buildAssistantMessage = (resultData: any, hasFile: boolean): Message => {
  const lastChat = resultData.chats?.[resultData.chats?.length - 1] || resultData.chats?.[0]
  const rawResponse = lastChat?.response || resultData.answer || resultData.response?.short_response || resultData.response || {}
  const fullReport = resultData.deep_research_answer || resultData.full_report || resultData.answer || {}
  const contentSections = formatResponseContent(rawResponse)
  const reportSections =
    typeof fullReport === "string"
      ? [{ title: "Report", content: fullReport }]
      : formatResponseContent(fullReport)

  return {
    id: (Date.now() + 1).toString(),
    content: contentSections,
    sender: "assistant",
    timestamp: formatToIST(lastChat?.time || resultData.time || new Date()),
    short_response: contentSections,
    full_report: reportSections,
    type: hasFile ? "image" : "text",
  }
}

// ─────────────────────────────────────────────────────────
// Shared message bubble renderer
// ─────────────────────────────────────────────────────────

function MessageBubble({ message, onViewReport }: {
  message: Message
  onViewReport?: (full: any, short: any) => void
}) {
  return (
    <div className={`flex gap-3 w-full ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      {message.sender === "assistant" && (
        <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AI</AvatarFallback>
        </Avatar>
      )}

      <div className={`p-4 rounded-2xl shadow-xs text-sm max-w-[85%] ${message.sender === "user"
        ? "bg-primary text-primary-foreground rounded-tr-sm"
        : "bg-card border border-border rounded-tl-sm"
        }`}>
        {message.image_url && message.sender === "user" && (
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.image_url} alt="Uploaded" className="rounded-lg max-h-48 object-cover border border-primary-foreground/20" />
          </div>
        )}

        <div className={message.sender === "assistant" ? "prose prose-sm max-w-none dark:prose-invert [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-600 dark:[&_h2]:text-indigo-400 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border [&_p]:text-base [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground" : ""}>
          {message.sender === "assistant" ? (
            <div className="space-y-4">
              {message.image_url && (
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={message.image_url} alt="AI Response" className="rounded-lg max-h-64 object-cover border" />
                </div>
              )}

              {Array.isArray(message.content) ? (
                message.content.map((section: any, idx: number) => {
                  const isRichSection = !!section.type;

                  return (
                    <div key={idx} className={`rounded-xl border shadow-xs overflow-hidden transition-all duration-300 ${isRichSection ? "bg-card dark:border-indigo-500/10 dark:shadow-[0_0_20px_-12px_rgba(99,102,241,0.3)]" : "p-4 bg-muted/40"}`}>
                      {isRichSection ? (
                        <>
                          <div className={`px-4 py-2.5 border-b flex items-center gap-2 bg-linear-to-r shadow-xs/5 relative overflow-hidden ${section.type === 'trend' ? "from-indigo-600/20 to-transparent dark:from-indigo-500/15" :
                            section.type === 'structure' ? "from-emerald-600/20 to-transparent dark:from-emerald-500/15" :
                              section.type === 'zones' ? "from-amber-600/20 to-transparent dark:from-amber-500/15" :
                                "from-blue-600/20 to-transparent dark:from-blue-500/15"
                            }`}>
                            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                            {section.type === 'trend' && <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                            {section.type === 'structure' && <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                            {section.type === 'zones' && <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                            {section.type === 'levels' && <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                            <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/90 dark:text-foreground/80">{section.title}</div>
                          </div>

                          <div className="p-4">
                            {section.type === 'trend' && (
                              <div className="space-y-3">
                                <div className="flex gap-2 items-center">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm ${section.content.trend_type?.toLowerCase().includes('up') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/30' :
                                    section.content.trend_type?.toLowerCase().includes('down') ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 dark:border dark:border-red-500/30' :
                                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}>
                                    {section.content.trend_type}
                                  </span>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border dark:border-indigo-500/30">
                                    {section.content.trend_strength}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground italic">
                                  "{section.content.description}"
                                </p>
                              </div>
                            )}

                            {section.type === 'structure' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">State</div>
                                  <div className="text-sm font-medium">{section.content.structure_state}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">Pattern</div>
                                  <div className="text-sm font-medium">{section.content.swing_sequence?.higher_high_lower_high_pattern}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Recent High</div>
                                  <div className="text-sm font-bold text-red-600 dark:text-red-400 drop-shadow-[0_0_4px_rgba(220,38,38,0.3)]">{section.content.swing_sequence?.recent_swing_high}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Recent Low</div>
                                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">{section.content.swing_sequence?.recent_swing_low}</div>
                                </div>
                              </div>
                            )}

                            {section.type === 'zones' && (
                              <div className="space-y-4">
                                {section.content.supply_zones?.length > 0 && (
                                  <div>
                                    <div className="text-[10px] font-semibold text-red-600 uppercase mb-2 flex items-center gap-1">
                                      <Target className="h-3 w-3" /> Supply Zones
                                    </div>
                                    <div className="space-y-2">
                                      {section.content.supply_zones.map((zone: any, i: number) => (
                                        <div key={i} className="bg-red-50/50 dark:bg-red-500/5 p-3 rounded-xl border border-red-100 dark:border-red-500/20 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
                                          <div className="text-sm font-bold text-red-700 dark:text-red-400 tracking-tight">{zone.zone_location}</div>
                                          <div className="text-[11px] text-red-600/80 dark:text-red-300/60 mt-1 leading-relaxed">{zone.rejection_evidence}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {section.content.demand_zones?.length > 0 && (
                                  <div>
                                    <div className="text-[10px] font-semibold text-emerald-600 uppercase mb-2 flex items-center gap-1">
                                      <Activity className="h-3 w-3" /> Demand Zones
                                    </div>
                                    <div className="space-y-2">
                                      {section.content.demand_zones.map((zone: any, i: number) => (
                                        <div key={i} className="bg-emerald-50/50 dark:bg-emerald-500/5 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                                          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">{zone.zone_location}</div>
                                          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-300/60 mt-1 leading-relaxed">{zone.acceptance_evidence}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {section.type === 'levels' && (
                              <div className="space-y-4">
                                <div>
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Resistance Levels</div>
                                  <div className="flex flex-wrap gap-2">
                                    {section.content.resistance_levels?.map((lvl: any, i: number) => (
                                      <div key={i} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-border shadow-xs">
                                        {lvl.level_description}
                                      </div>
                                    )) || "None"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-3 tracking-widest">Support Levels</div>
                                  <div className="flex flex-wrap gap-2.5">
                                    {section.content.support_levels?.map((lvl: any, i: number) => (
                                      <div key={i} className="bg-white/50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-border shadow-xs dark:text-emerald-400 text-emerald-700 hover:scale-105 transition-transform">
                                        {lvl.level_description}
                                      </div>
                                    )) || "None"}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-semibold text-indigo-600 mb-2">{section.title}</div>
                          {typeof section.content === "string" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {Object.entries(section.content).map(([key, value]: any, i) => (
                                <div key={i}>
                                  <span className="font-medium">{key}: </span>
                                  {Array.isArray(value) ? (
                                    <ul className="list-disc ml-5">{value.map((v: any, j: number) => <li key={j}>{v}</li>)}</ul>
                                  ) : (
                                    <span>{value}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })
              ) : typeof message.content === "string" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              ) : (
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(message.content, null, 2)}</pre>
              )}
            </div>
          ) : (
            <div className="text-base leading-relaxed whitespace-pre-wrap font-medium">
              {message.content}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-2.5">
          {message.sender === "assistant" && message.full_report && onViewReport ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewReport(message.full_report!, message.short_response!)}
              className="h-7 text-xs px-3 rounded-full bg-background border shadow-xs hover:border-primary/30 hover:bg-muted/50 transition-all"
            >
              <FileText className="h-3 w-3 mr-1.5" />
              View Full Report
            </Button>
          ) : (
            <span />
          )}
          <div className={`text-[10px] opacity-70 ${message.sender === "user" ? "text-primary-foreground" : "text-muted-foreground"}`}>
            {message.timestamp}
          </div>
        </div>
      </div>

      {message.sender === "user" && (
        <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Sidebar component for chat history
// ─────────────────────────────────────────────────────────

export function FxGuruSidebar({ currentChatId, isOpen, onClose }: { currentChatId?: string, isOpen?: boolean, onClose?: () => void }) {
  const [chats, setChats] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    getFxGuruConversations().then(setChats)
  }, [])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 md:relative md:z-10 md:flex flex-col md:w-64 border-r border-border bg-card/50 h-full overflow-hidden shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-3 border-b border-border shrink-0 flex items-center justify-between">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            onClick={() => {
              router.push('/fx-guru')
              if (onClose) onClose()
            }}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
          {onClose && (
            <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="text-[11px] font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Recent</div>
          {chats.length === 0 ? (
            <div className="text-xs text-center text-muted-foreground p-4">No past chats.</div>
          ) : (
            chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  router.push(`/fx-guru/${chat.conversationId}`)
                  if (onClose) onClose()
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors ${currentChatId === chat.conversationId
                  ? "bg-indigo-600/10 text-indigo-500 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <span className="truncate">{chat.title || "New Chat"}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// FxGuruLanding — initial screen: hero + chat input only
// ─────────────────────────────────────────────────────────

export function FxGuruLanding() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/login")
  }, [session, isPending, router])

  if (!session) return null

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file only (PNG, JPG, etc.).")
      clearFile()
      return
    }
    setSelectedFile(file)
    setPreviewFile(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = async () => {
    if (!session) {
      router.push("/auth/login")
      return
    }
    if ((!inputValue.trim() && !selectedFile) || isLoading) return
    setIsLoading(true)

    const hasFile = !!selectedFile
    const userMessage: Message = {
      id: Date.now().toString(),
      content: hasFile ? (selectedFile?.name || "Uploaded Image") : inputValue,
      sender: "user",
      timestamp: formatToIST(new Date()),
      image_url: previewFile || undefined,
      type: hasFile ? "image" : "text",
    }

    try {
      const body = new FormData()
      body.append("user_id", session.user.id)
      if (hasFile && selectedFile) body.append("image", selectedFile)
      const queryText = hasFile ? selectedFile.name : inputValue.trim()
      body.append("query", queryText)
      const title = hasFile ? selectedFile.name : inputValue.trim().slice(0, 50) || "New chat"
      body.append("title", title)
      body.append("chat_type", hasFile ? "With_Image" : "Only_Text")
      body.append("allowed_SEBI_guidelines", "true")

      setInputValue("")
      clearFile()

      const response = await apiClient.post(`${STOCK_GURU_MC_PATH}/chat`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const data = response.data
      if (data.success || data.status === "success" || data.data) {
        const resultData = data.data || data
        const assistantMessage = buildAssistantMessage(resultData, hasFile)

        const conversationId: string =
          resultData.conversation_id ||
          resultData.conversationId ||
          resultData.chat_id ||
          resultData.id ||
          resultData.chats?.[0]?.conversation_id ||
          resultData.chats?.[0]?.id ||
          resultData.chats?.[0]?.chat_id ||
          Date.now().toString()

        // Update user message timestamp if backend time is available
        const assistantTime = resultData.chats?.[0]?.time || resultData.time || new Date()
        userMessage.timestamp = formatToIST(assistantTime)

        const storageKey = `fx-guru-${session.user.id}-${conversationId}`
        localStorage.setItem(storageKey, JSON.stringify([userMessage, assistantMessage]))

        const apiConversationId = resultData.conversation_id || resultData.conversationId
        if (apiConversationId && resultData.session_id) {
          saveFxGuruConversation({
            conversationId: apiConversationId,
            sessionId: resultData.session_id,
            title: title || "New chat"
          }).catch((err) => console.error("Failed to save user conversation", err))
        }

        router.push(`/fx-guru/${conversationId}`)
      } else {
        throw new Error("API returned error status")
      }
    } catch (error) {
      console.error("Error calling API:", error)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="">
      <CommonBanner
        image={TradeImage}
        description='Discover, search, and analyze stocks with powerful chart insights, real-time data, and in-depth market intelligence—giving you complete visibility into performance trends, price movements, and every key factor needed to make smarter trading decisions, all in one advanced platform.'
        highlightedText="FX Guru:" title="Your Ultimate Stock 
Search & Market Intelligence 
Platform" />
      <FxGuruSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative">
        <motion.div
          className="w-full min-h-full flex flex-col justify-center items-center relative"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "tween", ease: "easeInOut" }}
        >
          <div className="flex-1 w-full flex flex-col items-center md:justify-center relative pt-8 md:pt-12 p-4 max-w-5xl rounded-3xl gap-4 md:gap-6">
            {/* Mobile Header Toggle */}
            <div className="md:hidden absolute top-4 left-4 z-30">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-300/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-blue-900/40" />
            <div className="absolute top-20 right-40 w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-purple-900/30" />
            <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-cyan-200/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-cyan-900/40" />

            <div className="text-center pt-12 md:pt-8 pb-4 flex flex-col items-center justify-center max-w-lg mx-auto z-20">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 whitespace-nowrap">Welcome to FXGuru</div>
              <div className="text-base md:text-lg text-muted-foreground mb-2 px-4">Stock insights are waiting. Talk to the FX Guru Assistant.</div>
            </div>

            <Stack className="items-center justify-center flex-1 z-10 w-full mb-8 md:mb-0" direction="column" size="lg" wrap={true}>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-4xl">
                <div className="flex flex-col items-center max-w-[320px] w-full group">
                  <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
                    <div className="w-40 h-44 bg-linear-to-br from-blue-700 to-indigo-900 rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                      <span className="text-5xl">📈</span>
                    </div>
                  </div>
                  <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[220px]">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3  leading-tight">Turn Charts Into Actionable Insights</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed px-2">
                      Instantly Turn Raw Charts Into Clear, Actionable Trade Insights With AI That Identifies Trends, Key Levels, Market Structure, And High-Probability Setups.
                    </p>
                  </Card>
                </div>

                <div className="flex flex-col items-center max-w-[320px] w-full group">
                  <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
                    <div className="w-40 h-44 bg-linear-to-br from-slate-900 to-black rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                      <span className="text-5xl">🐻</span>
                    </div>
                  </div>
                  <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[220px]">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 leading-tight">Ask Anything to The FX Guru Assistant</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed px-2">
                      Unlock Market Intelligence With The FXGuru Assistant — Ask Anything About Stocks, Analysis, Or Strategies And Get Expert-Level Insights In Seconds.
                    </p>
                  </Card>
                </div>
              </div>
            </Stack>

            <div className="w-full max-w-3xl z-20 pb-12 mt-auto mx-auto px-4 align-bottom">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col p-2 rounded-3xl border-2 transition-all duration-300 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                  ${isDragging
                    ? "border-indigo-500 border-dashed bg-indigo-50/20 dark:bg-indigo-500/10 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    : "border-indigo-500/20 dark:border-indigo-500/30 bg-white/80 dark:bg-slate-900/80"
                  } 
                  focus-within:border-indigo-500 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)] focus-within:ring-1 focus-within:ring-indigo-500`}
              >
                {previewFile && (
                  <div className="relative w-fit mb-3 ml-2 group animate-in zoom-in duration-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFile} alt="Preview" className="h-24 md:h-32 w-auto rounded-2xl object-cover border-2 border-indigo-500/20 shadow-md" />
                    <button
                      onClick={clearFile}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex flex-row items-center w-full px-1 flex-wrap md:flex-nowrap gap-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 shrink-0"
                  >
                    <ImageIcon className="size-5" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                    onChange={handleFileChange}
                  />
                  <input
                    type="text"
                    placeholder={selectedFile ? "File uploaded. Submit to continue." : "Ask Anything About Stocks Or Investments..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading || !!selectedFile}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:ring-0 disabled:opacity-50"
                    onKeyDown={handleKeyPress}
                  />
                  <Button
                    className="rounded-full w-10 h-10 p-0 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform active:scale-95"
                    onClick={handleSend}
                    disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                  >
                    {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4 -ml-0.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FxGuruChat — conversation detail page (chatId-aware)
// ─────────────────────────────────────────────────────────

export function FxGuruChat({ chatId }: { chatId: string }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [extSessionId, setExtSessionId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/login")
  }, [session, isPending, router])

  useEffect(() => {
    if (session && chatId) {
      const loadFromLocalStorage = (): boolean => {
        const storageKey = `fx-guru-${session.user.id}-${chatId}`
        const saved = localStorage.getItem(storageKey)
        if (!saved) return false
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setMessages(parsed)
            return true
          }
        } catch {
          console.error("Error parsing localStorage")
        }
        return false
      }

      const fetchHistory = async () => {
        setIsHistoryLoading(true)
        try {
          const res = await apiClient.get(`${STOCK_GURU_MC_PATH}/conversations/${chatId}`, {
            params: {
              page: 1,
              limit: 1000,
              user_id: session.user.id
            }
          })
          const data = res.data || {}
          const payload = data?.data || data
          const isSuccess =
            data?.success === true ||
            data?.status === "success" ||
            payload?.success === true ||
            Array.isArray(payload?.history)

          if (!isSuccess || !payload) {
            setExtSessionId(null)
            if (!loadFromLocalStorage()) setMessages([])
            return
          }

          setExtSessionId(payload.session_id || null)
          if (Array.isArray(payload.history) && payload.history.length > 0) {
            const loaded: Message[] = []
            payload.history.forEach((item: any) => {
              loaded.push({
                id: `user-${item.message_id}`,
                content: item.question,
                sender: "user",
                timestamp: formatToIST(item.time),
                type: item.chat_type === "With_Image" ? "image" : "text",
              })
              const assistantMsg = buildAssistantMessage({ answer: item.response, response: item.response, chats: [item] }, false)
              assistantMsg.id = `assistant-${item.message_id}`
              assistantMsg.timestamp = formatToIST(item.time)
              loaded.push(assistantMsg)
            })
            setMessages(loaded)
          } else if (!loadFromLocalStorage()) {
            setMessages([])
          }
        } catch (error) {
          console.error("Failed to load chat history from API", error)
          setExtSessionId(null)
          if (!loadFromLocalStorage()) setMessages([])
        } finally {
          setIsHistoryLoading(false)
        }
      }
      fetchHistory()
    }
  }, [session, chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  if (!session) return null

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file only (PNG, JPG, etc.).")
      clearFile()
      return
    }
    setSelectedFile(file)
    setPreviewFile(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = async () => {
    if (!session) {
      router.push("/auth/login")
      return
    }
    if ((!inputValue.trim() && !selectedFile) || isLoading) return
    const hasFile = !!selectedFile
    const userMessage: Message = {
      id: Date.now().toString(),
      content: hasFile ? (selectedFile?.name || "Uploaded Image") : inputValue,
      sender: "user",
      timestamp: formatToIST(new Date()),
      image_url: previewFile || undefined,
      type: hasFile ? "image" : "text",
    }

    setMessages((prev) => {
      const updated = [...prev, userMessage]
      if (session?.user?.id && chatId) {
        localStorage.setItem(`fx-guru-${session.user.id}-${chatId}`, JSON.stringify(updated))
      }
      return updated
    })
    setIsLoading(true)

    try {
      const body = new FormData()
      body.append("user_id", session.user.id)
      body.append("conversation_id", chatId)
      if (extSessionId) body.append("session_id", extSessionId)

      if (hasFile && selectedFile) body.append("image", selectedFile)
      body.append("query", hasFile ? selectedFile.name : inputValue.trim())
      const title = hasFile ? selectedFile.name : (inputValue.trim().slice(0, 50) || "New chat")
      body.append("title", title)
      body.append("chat_type", hasFile ? "With_Image" : "Only_Text")
      body.append("allowed_SEBI_guidelines", "true")

      setInputValue("")
      clearFile()

      const response = await apiClient.post(`${STOCK_GURU_MC_PATH}/chat`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const data = response.data
      if (data.success || data.status === "success" || data.data) {
        const resultData = data.data || data
        const assistantMessage = buildAssistantMessage(resultData, hasFile)
        setMessages((prev) => {
          // Update the last user message's timestamp with the backend time
          const updated = [...prev]
          const lastUserIndex = updated.map(m => m.sender).lastIndexOf("user")
          const assistantTime = resultData.chats?.[0]?.time || resultData.time || new Date()

          if (lastUserIndex !== -1) {
            updated[lastUserIndex] = { ...updated[lastUserIndex], timestamp: formatToIST(assistantTime) }
          }

          const finalMessages = [...updated, assistantMessage]

          // Sync to localStorage
          if (session?.user?.id && chatId) {
            const storageKey = `fx-guru-${session.user.id}-${chatId}`
            localStorage.setItem(storageKey, JSON.stringify(finalMessages))
          }
          return finalMessages
        })

        if (resultData.conversation_id && resultData.session_id) {
          saveFxGuruConversation({
            conversationId: resultData.conversation_id,
            sessionId: resultData.session_id,
            title: title || "New chat"
          }).catch((err) => console.error("Failed to save user conversation", err))
        }
      } else {
        throw new Error("API returned error status")
      }
    } catch (error) {
      console.error("Error calling API:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "assistant",
        timestamp: formatToIST(new Date()),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
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

  return (
    <div className="">
      <FxGuruSidebar currentChatId={chatId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AnimatePresence mode="wait">
        <motion.div
          key="chat-detail"
          className="flex flex-1 flex-col w-full h-full overflow-hidden"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
        >
          <div className="sticky top-0 z-10 p-4 border-b border-border bg-background shadow-xs shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground mr-1"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/fx-guru")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="font-bold text-base md:text-lg text-indigo-600 dark:text-indigo-400">FXGuru</div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs border border-border"
                onClick={() => router.push("/fx-guru")}
              >
                New Chat
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full p-4 space-y-6">
            {isHistoryLoading && messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Loading conversation…</p>
              </div>
            )}
            {!isHistoryLoading && messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No previous messages found. Ask a follow-up question to continue.</p>
              </div>
            )}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in zoom-in duration-300">
                <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AI</AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-foreground/80">
                    {selectedFile ? "Analyzing image..." : "Analyzing market data..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-background border-t border-border z-10 shrink-0">
            {previewFile && (
              <div className="relative w-fit mb-3 group animate-in zoom-in duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewFile} alt="Preview" className="h-20 w-auto rounded-xl object-cover border-2 border-primary/20 shadow-sm" />
                <button
                  onClick={clearFile}
                  className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-row items-center flex-wrap md:flex-nowrap gap-y-2 border rounded-2xl transition-all duration-200 pr-2 py-1 bg-background shadow-xs 
                ${isDragging
                  ? "border-primary border-dashed ring-2 ring-primary/20 bg-primary/5 scale-[1.01]"
                  : "border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
                }`}
            >
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full w-9 h-9 p-0 text-slate-500 hover:text-primary hover:bg-primary/5 ml-1"
              >
                <ImageIcon className="size-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                onChange={handleFileChange}
              />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={selectedFile ? "File uploaded." : "Ask a follow-up question..."}
                className="flex-1 min-w-0 min-h-[40px] p-2 bg-transparent text-sm border-none outline-none focus:ring-0 disabled:opacity-50"
                disabled={isLoading || !!selectedFile}
              />
              <Button
                onClick={handleSend}
                size="sm"
                className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95 shrink-0 shadow-sm"
                disabled={(!inputValue.trim() && !selectedFile) || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
