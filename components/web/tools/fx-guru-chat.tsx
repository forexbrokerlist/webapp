"use client"

import { useState } from "react"
import { Send, Loader2, FileText, User } from "lucide-react"
import { Button } from "~/components/common/button"
import { TextArea } from "~/components/common/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Avatar, AvatarFallback } from "~/components/common/avatar"
import { ContentPanel } from "./content-panel"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { apiClient, createApiClient } from "~/lib/api-client"
import { useSession } from "~/lib/auth-client"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: string
  short_response?: string
  full_report?: string
  currency_pair?: string
}

const major_pairs = [
  "EUR/USD",
  "USD/JPY",
  "GBP/USD",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "XAU/USD",
]
const euro_crosses = [
  "EUR/GBP",
  "EUR/CHF",
  "EUR/JPY",
  "EUR/AUD",
  "EUR/CAD",
  "EUR/NZD",
]
const pound_crosses = ["GBP/JPY", "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/NZD"]
const yen_crosses = ["CHF/JPY", "CAD/JPY", "AUD/JPY", "NZD/JPY"]
const other_crosses = ["AUD/CHF", "AUD/CAD", "AUD/NZD", "CAD/CHF", "NZD/CHF"]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function FxGuruChat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedPair, setSelectedPair] = useState(major_pairs[0])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [contentPanelScrollKey, setContentPanelScrollKey] = useState(0)
  const [propertyType, setPropertyType] = useState<"Questions" | "Blog">("Questions")
  const [selectedShortReport, setSelectedShortReport] = useState<string | null>(null)
  const [blogLoading, setBlogLoading] = useState(false)

  const handleGenerateBlog = async (input: string) => {
    try {
      setBlogLoading(true)
      const blogPayload = {
        input_data: input,
        is_content: true,
      }
      const response = await apiClient.post("/fx/blog_generation", blogPayload)
      const data = response.data

      if (data.status === "success") {
        const blogId = Date.now().toString()
        const blogMessage = {
          id: blogId,
          content: data?.generated_content,
          input: inputValue,
          timestamp: new Date().toLocaleTimeString(),
        }
        localStorage.setItem(blogId, JSON.stringify(blogMessage))
        window.open(`/generated-blog/${blogId}`, "_blank")
      }
    } catch (error) {
      console.error("Error calling API:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setInputValue("")
      setBlogLoading(false)
    }
  }

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      // Blog logic before first assistant message
      if (
        propertyType === "Blog" &&
        messages?.filter((datas) => datas?.sender == "assistant")?.length === 0
      ) {
        setIsLoading(true)
        try {
          const blogPayload = {
            input_data: inputValue,
            is_content: false,
          }
          const response = await createApiClient(API_BASE_URL).post("/fx/blog_generation", blogPayload)
          const data = response.data

          if (data.status === "success") {
            const blogId = Date.now().toString()
            const blogMessage = {
              id: blogId,
              content: data?.generated_content,
              input: inputValue,
              timestamp: new Date().toLocaleTimeString(),
            }
            localStorage.setItem(blogId, JSON.stringify(blogMessage))
            window.open(`/generated-blog/${blogId}`, "_blank")
          }
        } catch (error) {
          console.error("Error calling API:", error)
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Sorry, I encountered an error while processing your request. Please try again.",
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString(),
          }
          setMessages((prev) => [...prev, errorMessage])
        } finally {
          setInputValue("")
          setIsLoading(false)
        }
      } else {
        // Standard chat logic
        const userMessage: Message = {
          id: Date.now().toString(),
          content: inputValue,
          sender: "user",
          timestamp: new Date().toLocaleTimeString(),
          currency_pair: selectedPair,
        }

        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
          const response = await apiClient.post("/fx/v1/chat", {
            user_id: session?.user?.id || userId,
            message: inputValue,
            session_id: null,
            bot_type: "fx_guru",
            pair: selectedPair,
          })

          const data = response.data

          if (data.status === "success") {
            setUserId(data?.user_id)
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: data?.response?.short_response ?? "Here is your response.",
              sender: "assistant",
              timestamp: new Date().toLocaleTimeString(),
              short_response: data?.response?.short_response ?? "Here is your response.",
              full_report: data?.response?.full_report ?? data?.response,
              currency_pair: selectedPair,
            }

            setMessages((prev) => [...prev, assistantMessage])
            setSelectedReport(data?.response?.full_report ?? data?.response)
            setSelectedShortReport(data?.response?.short_response ?? data?.response)
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
          }
          setMessages((prev) => [...prev, errorMessage])
        } finally {
          setInputValue("")
          setIsLoading(false)
        }
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleViewReport = (fullReport: string, shortResponse: string) => {
    setSelectedReport(fullReport)
    setSelectedShortReport(shortResponse)
    setContentPanelScrollKey((prev) => prev + 1)
  }

  return (
    <div className="flex-1 w-full flex flex-col bg-muted/20 dark:bg-background overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {messages?.filter((datas) => datas?.sender == "assistant")?.length == 0 ? (
          // Fullscreen chat panel only
          <motion.div
            key="centered"
            className="w-full h-full flex flex-col justify-center items-center relative overflow-y-auto min-h-[calc(100vh-174px-var(--header-height))]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, type: "tween", ease: "easeInOut" }}
            layout
          >
            {/* Welcome message and input area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative pt-8 max-w-full">
              {/* Light gradient indigo background for bottom half */}
              {/* <div
                className="absolute inset-0 pointer-events-none z-10 opacity-70 dark:opacity-40 flex items-end"
                style={{
                  backgroundImage: "url('/lines.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center bottom",
                  maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                }}
              >
                  <div className="w-full h-[60%] bg-linear-to-t from-indigo-100/60 dark:from-indigo-900/20 to-transparent"></div>
              </div> */}

              <div className="w-full flex flex-col items-center justify-center relative z-20 px-4">
                <div className="text-center pt-8 pb-4 flex flex-col items-center justify-center max-w-lg mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sublogo.png" alt="FxGURU Logo" className="h-20 w-20 object-contain relative z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 tracking-tight">
                      Welcome to FxGURU
                    </div>
                    <div className="text-lg md:text-xl text-muted-foreground/90 font-medium mb-3">
                      Select a currency pair and start asking about market analysis!
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
                      Your AI-powered forex assistant
                    </div>
                  </motion.div>

                  {/* Centered segmented toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-full flex justify-center mb-6"
                  >
                    <div className="relative inline-flex items-center rounded-full p-1 bg-muted dark:bg-muted/50 border border-border/50 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setPropertyType("Questions")}
                        className={`px-8 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${propertyType === "Questions"
                          ? "bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-lg scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        Questions
                      </button>
                    </div>
                  </motion.div>

                  {/* Currency pair select */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="w-full flex justify-center mb-10"
                  >
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger id="currency-pair-select" className="w-[220px] h-12 bg-background/50 backdrop-blur-md border-indigo-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <SelectValue placeholder="Select currency pair" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto rounded-2xl shadow-2xl border-indigo-100 dark:border-white/10 backdrop-blur-xl" side="bottom">
                        <div className="px-3 py-2 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest opacity-70">Major Pairs</div>
                        {major_pairs.map((pair) => (
                          <SelectItem key={pair} value={pair} className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40">{pair}</SelectItem>
                        ))}
                        <div className="px-3 py-2 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest opacity-70 mt-3 border-t border-border/50">Euro Crosses</div>
                        {euro_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair} className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40">{pair}</SelectItem>
                        ))}
                        <div className="px-3 py-2 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest opacity-70 mt-3 border-t border-border/50">Pound Crosses</div>
                        {pound_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair} className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40">{pair}</SelectItem>
                        ))}
                        <div className="px-3 py-2 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest opacity-70 mt-3 border-t border-border/50">Yen Crosses</div>
                        {yen_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair} className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40">{pair}</SelectItem>
                        ))}
                        <div className="px-3 py-2 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest opacity-70 mt-3 border-t border-border/50">Other Crosses</div>
                        {other_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair} className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40">{pair}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
              </div>

              {/* Chat Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="w-full flex justify-center z-20 pb-12 mt-auto px-4"
              >
                <div className="max-w-3xl w-full group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-blue-500/20 blur-xl rounded-4xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <TextArea
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about EUR/USD, GBP/JPY, or any forex pair..."
                      className="min-h-[140px] pr-20 p-6 resize-none bg-white/80 dark:bg-muted/20 backdrop-blur-2xl border border-indigo-100 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all text-base text-foreground placeholder:text-muted-foreground/50"
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-5 right-5 flex">
                      <Button
                        onClick={handleSend}
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-500 to-blue-600 hover:scale-105 active:scale-95 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                        disabled={!inputValue.trim() || isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <Send className="size-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Two-column layout with chat left and content right
          <motion.div
            key="split"
            className="flex flex-col md:flex-row flex-1 w-full min-h-[calc(100vh-174px-var(--header-height))]"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.7, type: "tween", ease: "easeInOut" }}
            layout
          >
            {/* Chat area (left) */}
            <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 flex flex-col border-r border-border bg-background z-10 overflow-hidden">
              {/* Currency Pair Dropdown with Logo */}
              <div className="sticky top-0 z-10 p-5 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-1.5 rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/sublogo.png"
                        alt="FxGURU Logo"
                        className="h-7 w-7 object-contain cursor-pointer"
                        onClick={() => {
                          setMessages([])
                          setUserId(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setMessages([])
                            setUserId(null)
                          }
                        }}
                        tabIndex={0}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">FxGURU</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">AI Assistant</span>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[140px]">
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger id="currency-pair-select" className="h-9 bg-muted/30 border-none rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Pair" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto rounded-xl border-border/50 shadow-xl" side="bottom">
                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">Major Pairs</div>
                        {major_pairs.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase mt-1">Euro Crosses</div>
                        {euro_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase mt-1">Pound Crosses</div>
                        {pound_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase mt-1">Yen Crosses</div>
                        {yen_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase mt-1">Other Crosses</div>
                        {other_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto w-full p-4 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 w-full ${message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`p-4 rounded-2xl shadow-sm border text-sm max-w-[85%] transition-all duration-300 hover:shadow-md relative group/message ${message.sender === "user"
                        ? "bg-linear-to-br from-indigo-500 to-blue-600 text-white border-transparent rounded-tr-none ml-auto"
                        : "bg-muted/30 dark:bg-muted/10 backdrop-blur-sm border-border/50 rounded-tl-none"
                        }`}
                    >
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {message.sender === "assistant" ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content.split("\n").map((line, index) => (
                            <p key={index} className="m-0 text-inherit leading-relaxed">
                              {line}
                            </p>
                          ))
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-indigo-500/10 dark:border-white/5">
                        {/* View Report Button */}
                        {message.sender === "assistant" && message.full_report ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewReport(message.full_report!, message.short_response!)}
                            className="h-8 text-xs px-4 rounded-xl bg-muted/40 hover:bg-muted/80 border-none transition-all duration-300 font-semibold"
                            prefix={<FileText className="h-3 w-3" />}
                          >
                            View Analysis Report
                          </Button>
                        ) : (
                          <span />
                        )}
                        <div
                          className={`text-[10px] uppercase tracking-tighter font-bold opacity-50 ${message.sender === "user" ? "text-white" : "text-muted-foreground"
                            }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </motion.div>

                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 justify-start animate-in fade-in zoom-in duration-300">
                    <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-foreground/80">
                        Analyzing market data...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Layout Sidebar Input Area */}
              <div className="p-5 bg-background border-t border-border/50 z-10">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/10 to-blue-500/10 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <TextArea
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask a question..."
                      className="min-h-[100px] p-5 pr-16 resize-none bg-muted/20 dark:bg-muted/10 backdrop-blur-xl border-border/40 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all shadow-sm text-sm placeholder:text-muted-foreground/40"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="absolute bottom-4 right-4 h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 hover:scale-105 active:scale-95 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ContentPanel (right, larger) */}
            <motion.div
              className="flex-1 w-full bg-background"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.7, type: "tween", ease: "easeInOut" }}
              layout
            >
              <ContentPanel
                fullReport={selectedReport}
                selectedShortReport={selectedShortReport}
                isLoading={isLoading}
                blogLoading={blogLoading}
                scrollToTopSignal={contentPanelScrollKey}
                handleGenerateBlog={handleGenerateBlog}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Blog Loading overlay */}
      {
        blogLoading && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
              <div className="space-y-1 text-center">
                <p className="text-base font-medium text-foreground">Generating Blog Content</p>
                <p className="text-sm text-muted-foreground">Please wait while the AI writes your article...</p>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
