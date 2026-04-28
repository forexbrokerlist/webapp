"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, FileText, User, Image as ImageIcon, X, ArrowLeft, MessageSquare, Plus, TrendingUp, Layers, Zap, Shield, Target, Activity, Menu, Delete, Trash, Sparkles, Lightbulb, ClipboardList } from "lucide-react"
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
const AskIcon = '/assets/images/ask.svg';
const FxguruIcon = '/assets/images/fxguru.svg';

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
      {/* {message.sender === "assistant" && (
        <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AI</AvatarFallback>
        </Avatar>
      )} */}

      <div className={`p-4 rounded-2xl shadow-xs text-sm max-w-[85%] ${message.sender === "user"
        ? "bg-gradient-to-b from-[#FFF] to-[rgba(168,221,21,0.30)] text-black100 rounded-tr-sm"
        : "bg-card border border-border rounded-tl-sm"
        }`}>
        {message.image_url && message.sender === "user" && (
          <div className="mb-2">

            <img src={message.image_url} alt="Uploaded" className="rounded-lg max-h-48 object-cover border border-primary-foreground/20" />
          </div>
        )}

        <div className={message.sender === "assistant" ? "prose prose-sm max-w-none dark:prose-invert [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-600 dark:[&_h2]:text-indigo-400 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border [&_p]:text-base [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground" : ""}>
          {message.sender === "assistant" ? (
            <div className="space-y-2">
              {message.image_url && (
                <div className="mb-2">

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
              className="h-7 text-xs px-3 rounded-full bg-background border shadow-xs text-black100 transition-all"
            >
              <FileText className="h-3 w-3 mr-1.5" />
              View Full Report
            </Button>
          ) : (
            <span />
          )}
          <div className={`text-[10px] opacity-70 ${message.sender === "user" ? "text-black100" : "text-black100"}`}>
            {message.timestamp}
          </div>
        </div>
      </div>

      {/* {message.sender === "user" && (
        <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )} */}
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
      <div className="bg-white rounded-xl border border-solid border-border-light300">
        <div className="p-3 ">
          <Button variant="secondary" className="py-2 text-base w-full" onClick={() => {
            router.push('/fx-guru')
            if (onClose) onClose()
          }}>
            <div className="flex items-center  gap-2">
              <Plus className="h-4 w-4" />
            </div>
            New Chat
          </Button>
          <div className="flex items-center gap-3 my-3 px-2">
            <div className="h-[1.5px] flex-1 bg-primary"></div>
            <span className="text-sm font-medium text-black700 whitespace-nowrap">Search History</span>
            <div className="h-[1.5px] flex-1 bg-primary"></div>
          </div>
        </div>
        <div className="flex-1 h-[calc(100%-110px)] overflow-y-auto p-3 pt-0 space-y-3">
          {/* <div className="text-[11px] font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Recent</div> */}
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
                className={`w-full cursor-pointer flex items-center justify-between gap-2 p-1 pl-3.5  bg-[#F0F1EC] rounded-full transition-colors ${currentChatId === chat.conversationId
                  ? ""
                  : ""
                  }`}
              >
                {/* <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" /> */}
                <span className="truncate line-clamp-1 text-black800 text-base">{chat.title || "New Chat"}</span>
                <div className="w-9 min-w-9 min-h-9 h-9 flex cursor-pointer items-center justify-center bg-white rounded-full shadow-xs">
                  <Trash className="text-[#FF5151] w-4 h-4" color="#FF5151" />
                </div>
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

  // Redirect removed for guest access

  // if (!session) return null

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
      router.push("/auth/login?next=/fx-guru")
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
      <div className="pb-100">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="grid grid-cols-[390px_1fr] gap-5">
            <FxGuruSidebar />
            <div className="">

              <div className="bg-white rounded-xl border border-solid border-border-light300 px-4 py-[60px]">
                <div className="max-w-[980px] mx-auto">
                  <div className="pb-10">
                    <div className="flex justify-center">
                      <img src={FxguruIcon} alt="FxguruIcon" className="block" />
                    </div>
                    <h2 className="text-3xl text-black font-bold text-center mb-3">
                      Welcome to FXGuru
                    </h2>
                    <p className="text-lg font-medium text-black700 max-w-[733px] mx-auto text-center">
                      Your intelligent forex trading companion. Get instant market insights, chart
                      analysis,
                      and expert-level trading strategies powered by AI.
                    </p>
                  </div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col rounded-3xl border transition-all duration-300 bg-white shadow-xs
                  ${isDragging
                        ? "border-primary border-dashed bg-primary/5 scale-[1.01]"
                        : "border-primary"
                      } 
                  focus-within:shadow-[0_0_20px_rgba(168,221,21,0.2)]`}
                  >
                    {/* Top Section: Icon + Textarea */}
                    <div className="flex items-start gap-3 p-5 pb-2">
                      <div className="shrink-0 mt-1">
                        <img src={AskIcon} alt="AskIcon" />
                      </div>
                      <textarea
                        placeholder={selectedFile ? "File uploaded. Submit to continue." : "Ask anything about forex trading, chart and strategies.."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading || !!selectedFile}
                        className="flex-1 bg-transparent border-none outline-none text-base text-black800 placeholder:text-black/40 focus:ring-0 disabled:opacity-50 min-h-[50px] resize-none"
                        onKeyDown={handleKeyPress}
                      />
                    </div>

                    {/* Middle Section: Image Preview (if any) */}
                    {previewFile && (
                      <div className="px-5 pb-3">
                        <div className="relative w-fit group animate-in zoom-in duration-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewFile} alt="Preview" className="h-20 w-auto rounded-xl object-cover border-2 border-primary/20 shadow-sm" />
                          <button
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Section: Upload + Send */}
                    <div className="flex items-center justify-between p-4 pt-0">
                      <div className="flex items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M14.0007 2.33203C20.4439 2.33203 25.6673 7.55537 25.6673 13.9987C25.6673 20.4421 20.4439 25.6653 14.0007 25.6653C7.55733 25.6653 2.33398 20.4421 2.33398 13.9987M10.3945 2.90005C9.21732 3.28226 8.12223 3.84655 7.14244 4.55968M4.56165 7.14045C3.84839 8.12042 3.28402 9.21574 2.9018 10.3931" stroke="#121212" stroke-opacity="0.7" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M14.0007 9.33203V18.6653M18.6673 13.9987H9.33398" stroke="#121212" stroke-opacity="0.7" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={handleFileChange}
                      />

                      <Button
                        className="bg-primary  text-black font-medium rounded-full cursor-pointer px-5 py-2 h-auto flex items-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
                        onClick={handleSend}
                        disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                      >
                        {isLoading ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="size-4" />
                            <span>Ask Guru</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                    <div className="p-4 rounded-xl border border-blue-200 bg-white shadow-xs relative overflow-hidden flex flex-col gap-4 group transition-all hover:shadow-md">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-blue-400" />
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 shadow-xs relative z-10">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h3 className="font-bold text-black text-lg">Chart Analysis</h3>
                        <p className="text-sm text-black700 leading-relaxed">
                          Upload any forex chart and get instant AI-powered analysis with trend identification, support/resistance levels, and trade opportunities.
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Trading Insights */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-white shadow-xs relative overflow-hidden flex flex-col gap-4 group transition-all hover:shadow-md">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-xs relative z-10">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h3 className="font-bold text-black text-lg">Trading Insights</h3>
                        <p className="text-sm text-black700 leading-relaxed">
                          Ask questions about forex strategies, market conditions, technical indicators, and get expert-level answers instantly.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Strategy Builder */}
                    <div className="p-4 rounded-xl border border-red-200 bg-white shadow-xs relative overflow-hidden flex flex-col gap-4 group transition-all hover:shadow-md">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-red-400" />
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 text-red-600 shadow-xs relative z-10">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h3 className="font-semibold text-black text-lg">Strategy Builder</h3>
                        <p className="text-sm text-black700 leading-relaxed">
                          Create and refine your trading strategies with AI guidance tailored to your risk tolerance and goals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
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

  // Redirect removed for guest access

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

  // Session check removed to allow guest viewing

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
      router.push("/auth/login?next=/fx-guru")
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
    <div className="pt-100">
      <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
        <div className="grid grid-cols-[390px_1fr] gap-5 pb-8">
          <FxGuruSidebar currentChatId={chatId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <AnimatePresence mode="wait">
            <motion.div
              key="chat-detail"
              className="flex flex-1 flex-col w-full h-[calc(100dvh-132px)] overflow-auto bg-white rounded-xl border border-solid border-border-light300"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
            >
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

              <div className="sticky bottom-0 p-4 ">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col rounded-[32px] border transition-all duration-300 bg-white shadow-xs 
                ${isDragging
                      ? "border-primary border-dashed bg-primary/5 scale-[1.01]"
                      : "border-primary"
                    } 
                focus-within:shadow-[0_0_20px_rgba(168,221,21,0.2)]`}
                >
                  {/* Top Section: Icon + Textarea */}
                  <div className="flex items-start gap-3 p-5 pb-2">
                    <div className="shrink-0 mt-1">
                      {/* Black Smiley Icon */}
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className="w-3 h-1.5 border-b-2 border-white rounded-full mt-[-2px]"></div>
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-black rotate-45"></div>
                      </div>
                    </div>
                    <textarea
                      placeholder={selectedFile ? "File uploaded. Submit to continue." : "Ask anything about forex trading, chart and strategies.."}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoading || !!selectedFile}
                      className="flex-1 bg-transparent border-none outline-none text-base text-black800 placeholder:text-black/40 focus:ring-0 disabled:opacity-50 min-h-[50px] resize-none"
                      onKeyDown={handleKeyPress}
                    />
                  </div>

                  {/* Middle Section: Image Preview (if any) */}
                  {previewFile && (
                    <div className="px-5 pb-3">
                      <div className="relative w-fit group animate-in zoom-in duration-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewFile} alt="Preview" className="h-20 w-auto rounded-xl object-cover border-2 border-primary/20 shadow-sm" />
                        <button
                          onClick={clearFile}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Section: Upload + Send */}
                  <div className="flex items-center justify-between p-5 pt-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-full border border-border-light300 flex items-center justify-center text-black/60 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                      onChange={handleFileChange}
                    />

                    <Button
                      className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full px-6 py-2.5 h-auto flex items-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
                      onClick={handleSend}
                      disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                    >
                      {isLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          <span>Ask Guru</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
