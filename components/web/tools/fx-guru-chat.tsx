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
            pair: selectedPair,
            message: inputValue,
            history: [],
            user_id: userId,
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
              <div
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
              </div>

              <div className="w-full flex flex-col items-center justify-center relative z-20 px-4">
                <div className="text-center pt-8 pb-4 flex flex-col items-center justify-center max-w-lg mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sublogo.png" alt="FxGURU Logo" className="h-16 w-16 object-contain mb-4" />
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    Welcome to FxGURU
                  </div>
                  <div className="text-lg text-muted-foreground mb-2">
                    Select a currency pair and start asking about market analysis!
                  </div>
                  <div className="text-sm font-medium text-indigo-500/80 dark:text-indigo-400/80 mb-6">
                    Your AI-powered forex assistant
                  </div>

                  {/* Centered segmented toggle */}
                  <div className="w-full flex justify-center mb-6">
                    <div className="relative inline-flex items-center rounded-full p-1 bg-indigo-600">
                      <button
                        type="button"
                        onClick={() => setPropertyType("Questions")}
                        className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                          propertyType === "Questions"
                            ? "bg-white text-indigo-700 shadow"
                            : "text-white/90 hover:text-white"
                        }`}
                      >
                        Questions
                      </button>
                      <button
                        type="button"
                        onClick={() => setPropertyType("Blog")}
                        className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                          propertyType === "Blog"
                            ? "bg-white text-indigo-700 shadow"
                            : "text-white/90 hover:text-white"
                        }`}
                      >
                        Blog
                      </button>
                    </div>
                  </div>

                  {/* Currency pair select */}
                  <div className="w-full flex justify-center mb-10">
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger id="currency-pair-select" className="w-[200px] h-11 bg-background">
                        <SelectValue placeholder="Select currency pair" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Major Pairs</div>
                        {major_pairs.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Euro Crosses</div>
                        {euro_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Pound Crosses</div>
                        {pound_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Yen Crosses</div>
                        {yen_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Other Crosses</div>
                        {other_crosses.map((pair) => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="w-full flex justify-center z-20 pb-12 mt-auto px-4">
                <div className="max-w-3xl w-full">
                  <div className="relative">
                    <TextArea
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about EUR/USD, GBP/JPY, or any forex pair..."
                      className="min-h-[140px] pr-16 p-5 resize-none bg-white/70 dark:bg-muted/10 backdrop-blur-xl border border-indigo-100 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all text-base text-foreground placeholder:text-muted-foreground/70"
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-4 right-4 flex">
                      <Button
                        onClick={handleSend}
                        size="sm"
                        className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md transition-transform active:scale-95"
                        disabled={!inputValue.trim() || isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <Send className="size-5 -ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
              <div className="sticky top-0 z-10 p-4 border-b border-border bg-background shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/mainlogo.png"
                      alt="FxGURU Logo"
                      className="h-6 w-auto object-contain cursor-pointer dark:invert"
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
                  <div>
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger id="currency-pair-select" className="w-[140px] h-9 bg-background text-sm">
                        <SelectValue placeholder="Pair" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom">
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
                      className={`flex gap-3 w-full ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "assistant" && (
                        <Avatar className="h-8 w-8 shadow-xs shrink-0 mt-1">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`p-4 rounded-2xl shadow-xs text-sm max-w-[85%] ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card border border-border rounded-tl-sm"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.sender === "assistant" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            message.content.split("\n").map((line, index) => (
                              <p key={index} className="m-0 text-inherit">
                                {line}
                              </p>
                            ))
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-2.5">
                          {/* View Report Button */}
                          {message.sender === "assistant" && message.full_report ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewReport(message.full_report!, message.short_response!)}
                              className="h-7 text-xs px-3 rounded-full bg-background border shadow-xs hover:border-primary/30 hover:bg-muted/50 transition-all"
                            >
                              <FileText className="h-3 w-3 mr-1.5" />
                              View Full Report
                            </Button>
                          ) : (
                            <span />
                          )}
                          <div
                            className={`text-[10px] opacity-70 ${
                              message.sender === "user" ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          >
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
              <div className="p-4 bg-background border-t border-border z-10">
                <div className="relative">
                    <TextArea
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask a question..."
                      className="min-h-[80px] p-3 pr-12 resize-none bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all shadow-sm text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      size="sm"
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95"
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
      {blogLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
            <div className="space-y-1 text-center">
              <p className="text-base font-medium text-foreground">Generating Blog Content</p>
              <p className="text-sm text-muted-foreground">Please wait while the AI writes your article...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
