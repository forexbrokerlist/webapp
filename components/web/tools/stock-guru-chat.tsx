"use client"

import { ImageIcon, SendIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { Stack } from "~/components/common/stack"

export const StockGuruChat = () => {
  const [input, setInput] = useState("")

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[#f5f8fc] dark:bg-background">
      <div className="flex-1 w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(8,112,184,0.07)] dark:shadow-none p-4 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between border dark:border-border gap-6">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-300/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-blue-900/40"></div>
        <div className="absolute top-20 right-40 w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-purple-900/30"></div>
        <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-cyan-200/40 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none dark:bg-cyan-900/40"></div>

        <Stack className="items-center justify-center flex-1 z-10 w-full" direction="row" size="lg" wrap={true}>
          {/* Bull Card */}
          <div className="flex flex-col items-center max-w-[320px] w-full group">
            <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
               {/* Stand-in for Bull image - using a stylized div since we don't have the asset */}
               <div className="w-40 h-44 bg-linear-to-br from-blue-700 to-indigo-900 rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                  <span className="text-5xl">📈</span>
               </div>
            </div>
            <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[180px]">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 leading-tight">Turn Charts Into Actionable Insights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed px-2">
                Instantly Turn Raw Charts Into Clear, Actionable Trade Insights With AI That Identifies Trends, Key Levels, Market Structure, And High-Probability Setups.
              </p>
            </Card>
          </div>

          {/* Bear Card */}
          <div className="flex flex-col items-center max-w-[320px] w-full group">
            <div className="relative z-20 -mb-16 transition-transform duration-500 group-hover:-translate-y-4">
              {/* Stand-in for Bear image */}
              <div className="w-40 h-44 bg-linear-to-br from-slate-900 to-black rounded-t-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                  <span className="text-5xl">🐻</span>
              </div>
            </div>
            <Card className="pt-20 pb-6 px-6 text-center shadow-xl w-full border-white/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] min-h-[180px]">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 leading-tight">Ask Anything to The Stock Guru Assistant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed px-2">
                Unlock Market Intelligence With The StockGuru Assistant — Ask Anything About Stocks, Analysis, Or Strategies And Get Expert-Level Insights In Seconds.
              </p>
            </Card>
          </div>
        </Stack>

        {/* Chat Input */}
        <div className="z-10 w-full max-w-3xl mx-auto align-bottom">
          <div className="relative flex items-center p-2 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 bg-white dark:bg-slate-900 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30">
            <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 shrink-0">
              <ImageIcon className="size-5" />
            </Button>
            
            <input 
              type="text" 
              placeholder="" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  // Handle send logic
                  setInput("")
                }
              }}
            />
            
            <Button 
              className="rounded-full w-10 h-10 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-95" 
              onClick={() => {
                if (input.trim()) {
                  setInput("")
                }
              }}
            >
              <SendIcon className="size-4 -ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
