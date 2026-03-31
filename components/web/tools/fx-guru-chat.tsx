"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, FileText, User, Image as ImageIcon, X, ArrowLeft, MessageSquare, Plus } from "lucide-react"
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

const formatResponseContent = (response: any) => {
  if (typeof response === "string") return response
  const sections: any[] = []
  if (response.overall_summary) sections.push(renderSection("Overall Summary", response.overall_summary))
  if (response.overall_trend) {
    sections.push(renderSection("Market Analysis", {
      "Trend Type": response.overall_trend.trend_type,
      "Trend Strength": response.overall_trend.trend_strength,
      "Description": response.overall_trend.description,
    }))
  }
  if (response.market_structure) {
    sections.push(renderSection("Market Structure", {
      "Structure State": response.market_structure.structure_state,
      "Pattern": response.market_structure.swing_sequence?.higher_high_lower_high_pattern,
    }))
  }
  if (response.support_and_resistance) {
    sections.push(renderSection("Support & Resistance", {
      Support: response.support_and_resistance.support_levels?.map((s: any) => s.level_description),
      Resistance: response.support_and_resistance.resistance_levels?.map((r: any) => r.level_description),
    }))
  }
  if (response.supply_and_demand_zones) {
    sections.push(renderSection("Supply & Demand", {
      Supply: response.supply_and_demand_zones.supply_zones?.map((z: any) => z.zone_location),
      Demand: response.supply_and_demand_zones.demand_zones?.map((z: any) => z.zone_location),
    }))
  }
  return sections
}

const buildAssistantMessage = (resultData: any, hasFile: boolean): Message => {
  const rawResponse = resultData.chats?.[0]?.response || resultData.answer || resultData.response?.short_response || {}
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
    timestamp: new Date().toLocaleTimeString(),
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

        <div className="prose prose-sm max-w-none dark:prose-invert [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-600 dark:[&_h2]:text-indigo-400 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border [&_p]:text-base [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground">
          {message.sender === "assistant" ? (
            <div className="space-y-4">
              {message.image_url && (
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={message.image_url} alt="AI Response" className="rounded-lg max-h-64 object-cover border" />
                </div>
              )}

              {Array.isArray(message.content) ? (
                message.content.map((section: any, idx: number) => (
                  <div key={idx} className="rounded-xl border p-4 bg-muted/40">
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
                  </div>
                ))
              ) : typeof message.content === "string" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              ) : (
                <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(message.content, null, 2)}</pre>
              )}
            </div>
          ) : (
            message.content.split("\n").map((line: any, index: any) => <p key={index}>{line}</p>)
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

export function FxGuruSidebar({ currentChatId }: { currentChatId?: string }) {
  const [chats, setChats] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    getFxGuruConversations().then(setChats)
  }, [])

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 h-full overflow-hidden shrink-0 z-10 relative">
      <div className="p-3 border-b border-border shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          onClick={() => router.push('/fx-guru')}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <div className="text-[11px] font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Recent</div>
        {chats.length === 0 ? (
          <div className="text-xs text-center text-muted-foreground p-4">No past chats.</div>
        ) : (
          chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => router.push(`/fx-guru/${chat.conversationId}`)}
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

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/login")
  }, [session, isPending, router])

  if (!session) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewFile(URL.createObjectURL(file))
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
      timestamp: new Date().toLocaleTimeString(),
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
    <div className="h-full flex flex-row w-full bg-muted/20 dark:bg-background overflow-hidden relative">
      <FxGuruSidebar />
      <div className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative">
        <motion.div
          className="w-full min-h-full flex flex-col justify-center items-center relative"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "tween", ease: "easeInOut" }}
        >
          <div className="flex-1 w-full flex flex-col items-center justify-center relative pt-8 p-4 max-w-5xl rounded-3xl overflow-hidden gap-6">
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-300/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-blue-900/40" />
            <div className="absolute top-20 right-40 w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-purple-900/30" />
            <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-cyan-200/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-cyan-900/40" />

            <div className="text-center pt-8 pb-4 flex flex-col items-center justify-center max-w-lg mx-auto z-20">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome to FXGuru</div>
              <div className="text-lg text-muted-foreground mb-2">Stock insights are waiting. Talk to the FX Guru Assistant.</div>
            </div>

            <Stack className="items-center justify-center flex-1 z-10 w-full" direction="row" size="lg" wrap={true}>
              <div className="flex flex-col items-center max-w-[320px] w-full group">
                <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
                  <div className="w-40 h-44 bg-linear-to-br from-blue-700 to-indigo-900 rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                    <span className="text-5xl">📈</span>
                  </div>
                </div>
                <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[220px]">
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 leading-tight">Turn Charts Into Actionable Insights</h3>
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
            </Stack>

            <div className="w-full max-w-3xl z-20 pb-12 mt-auto mx-auto px-4 align-bottom">
              <div className="relative flex flex-col p-2 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30">
                {previewFile && (
                  <div className="relative w-fit mb-2 ml-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFile} alt="Preview" className="h-20 w-auto rounded-lg object-cover border" />
                    <button onClick={clearFile} className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                )}
                <div className="flex flex-row items-center w-full">
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
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:ring-0 disabled:opacity-50"
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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
                timestamp: new Date(item.time).toLocaleTimeString(),
                type: item.chat_type === "With_Image" ? "image" : "text",
              })
              const assistantMsg = buildAssistantMessage({ answer: item.response, response: item.response, chats: [item] }, false)
              assistantMsg.id = `assistant-${item.message_id}`
              assistantMsg.timestamp = new Date(item.time).toLocaleTimeString()
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewFile(URL.createObjectURL(file))
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
      timestamp: new Date().toLocaleTimeString(),
      image_url: previewFile || undefined,
      type: hasFile ? "image" : "text",
    }

    setMessages((prev) => [...prev, userMessage])
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
        setMessages((prev) => [...prev, assistantMessage])

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
        timestamp: new Date().toLocaleTimeString(),
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
    <div className="h-full w-full flex flex-row bg-background overflow-hidden">
      <FxGuruSidebar currentChatId={chatId} />
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
                  size="sm"
                  className="rounded-full w-9 h-9 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/fx-guru")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">FXGuru</div>
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
              <div className="relative w-fit mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewFile} alt="Preview" className="h-16 w-auto rounded-lg object-cover border" />
                <button onClick={clearFile} className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 shadow-sm">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            )}
            <div className="relative flex flex-row items-center border border-input rounded-xl focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-background shadow-sm pr-2">
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-primary hover:bg-muted ml-1"
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
                className="flex-1 min-h-[40px] p-2 bg-transparent text-sm border-none outline-none focus:ring-0 disabled:opacity-50"
                disabled={isLoading || !!selectedFile}
              />
              <Button
                onClick={handleSend}
                size="sm"
                className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95 shrink-0"
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
