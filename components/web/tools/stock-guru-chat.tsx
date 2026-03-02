"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, FileText, User, Image as ImageIcon, X } from "lucide-react"
import { Button } from "~/components/common/button"
import { TextArea } from "~/components/common/textarea"
import { Avatar, AvatarFallback } from "~/components/common/avatar"
import { ContentPanel } from "./content-panel"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { apiClient } from "~/lib/api-client"
import { Card } from "~/components/common/card"
import { Stack } from "~/components/common/stack"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: string
  short_response?: string
  full_report?: string
  image_url?: string
}

const STOCK_GURU_MC_PATH = "/stock-guru/api/v1"

export function StockGuruChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [selectedShortReport, setSelectedShortReport] = useState<string | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [contentPanelScrollKey, setContentPanelScrollKey] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewFile(URL.createObjectURL(file))
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedFile) || isLoading) return

    const hasFile = !!selectedFile
    const messageContent = hasFile ? (selectedFile?.name || "Uploaded Image") : inputValue

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      image_url: previewFile || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const body = new FormData()
      if (hasFile && selectedFile) {
        body.append("image", selectedFile)
      }
      body.append("query", hasFile ? selectedFile.name : inputValue.trim())
      
      if (!currentChatId) {
        const title = hasFile 
          ? selectedFile.name 
          : (inputValue.trim() ? inputValue.trim().slice(0, 50) : "New chat")
        body.append("title", title)
      }
      body.append("chat_type", hasFile ? "With_Image" : "Only_Text")
      
      if (currentChatId) {
        body.append("conversation_id", currentChatId)
      }
      
      // Default to allowed SEBI guidelines based on typical prod usage
      body.append("allowed_SEBI_guidelines", "true")

      // Clear layout inputs immediately
      setInputValue("")
      clearFile()

      const response = await apiClient.post(`${STOCK_GURU_MC_PATH}/chat`, body, {
        headers: {
          // Let axios construct multipart/form-data boundary automatically
          "Content-Type": "multipart/form-data",
        },
      })

      const data = response.data

      if (data.success || data.status === "success" || data.data) {
        // Dhanarthi returns data in `data.data` typically
        const resultData = data.data || data
        if (resultData.conversation_id && !currentChatId) {
          setCurrentChatId(resultData.conversation_id)
        }

        const answerText = resultData.answer || resultData.response?.short_response || "Here is your response."
        const fullReport = resultData.deep_research_answer || resultData.full_report || resultData.answer || "No full report generated."
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: answerText,
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString(),
          short_response: answerText,
          full_report: fullReport,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setSelectedReport(fullReport)
        setSelectedShortReport(answerText)
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
      setIsLoading(false)
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
        {messages.length === 0 ? (
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
            <div className="flex-1 w-full flex flex-col items-center justify-center relative pt-8 p-4 max-w-5xl rounded-3xl overflow-hidden gap-6">
              {/* Glow Effects */}
              <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-300/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-blue-900/40"></div>
              <div className="absolute top-20 right-40 w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-purple-900/30"></div>
              <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-cyan-200/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-cyan-900/40"></div>

              <div className="text-center pt-8 pb-4 flex flex-col items-center justify-center max-w-lg mx-auto z-20">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  Welcome to StockGuru
                </div>
                <div className="text-lg text-muted-foreground mb-2">
                  Stock insights are waiting. Talk to the Stock Guru Assistant.
                </div>
              </div>

              <Stack className="items-center justify-center flex-1 z-10 w-full" direction="row" size="lg" wrap={true}>
                {/* Bull Card */}
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

                {/* Bear Card */}
                <div className="flex flex-col items-center max-w-[320px] w-full group">
                  <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
                    <div className="w-40 h-44 bg-linear-to-br from-slate-900 to-black rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                        <span className="text-5xl">🐻</span>
                    </div>
                  </div>
                  <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[220px]">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 leading-tight">Ask Anything to The Stock Guru Assistant</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed px-2">
                      Unlock Market Intelligence With The StockGuru Assistant — Ask Anything About Stocks, Analysis, Or Strategies And Get Expert-Level Insights In Seconds.
                    </p>
                  </Card>
                </div>
              </Stack>

              {/* Chat Input Area */}
              <div className="w-full max-w-3xl z-20 pb-12 mt-auto mx-auto px-4 align-bottom">
                <div className="relative flex flex-col p-2 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30">
                  {previewFile && (
                    <div className="relative w-fit mb-2 ml-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewFile} alt="Preview" className="h-20 w-auto rounded-lg object-cover border" />
                      <button 
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1"
                      >
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
                      {isLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Send className="size-4 -ml-0.5" />
                      )}
                    </Button>
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
              <div className="sticky top-0 z-10 p-4 border-b border-border bg-background shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">StockGuru</div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="text-xs border border-border"
                    onClick={() => {
                        setMessages([])
                        setCurrentChatId(null)
                        clearFile()
                        setInputValue("")
                    }}
                  >
                    New Chat
                  </Button>
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
                        {message.image_url && (
                          <div className="mb-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={message.image_url} alt="Uploaded" className="rounded-lg max-h-48 object-cover border border-primary-foreground/20" />
                          </div>
                        )}
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
                          {selectedFile ? "Analyzing image..." : "Analyzing market data..."}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Layout Sidebar Input Area */}
              <div className="p-4 bg-background border-t border-border z-10">
                {previewFile && (
                  <div className="relative w-fit mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFile} alt="Preview" className="h-16 w-auto rounded-lg object-cover border" />
                    <button 
                      onClick={clearFile}
                      className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 shadow-sm"
                    >
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
                      placeholder={selectedFile ? "File uploaded." : "Ask a question..."}
                      className="flex-1 min-h-[40px] p-2 bg-transparent text-sm border-none outline-none focus:ring-0 disabled:opacity-50"
                      disabled={isLoading || !!selectedFile}
                    />
                    <Button
                      onClick={handleSend}
                      size="sm"
                      className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95 shrink-0"
                      disabled={(!inputValue.trim() && !selectedFile) || isLoading}
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
                blogLoading={false}
                scrollToTopSignal={contentPanelScrollKey}
                handleGenerateBlog={() => {}} // StockGuru may not need blog generation initially
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
