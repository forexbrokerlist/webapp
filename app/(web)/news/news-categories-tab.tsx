"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

interface NewsCategoriesTabProps {
    onSourceChange: (source: string) => void
    activeTab: string
}

export default function NewsCategoriesTab({
    onSourceChange,
    activeTab,
}: NewsCategoriesTabProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const [sources, setSources] = useState<string[]>(["All Sources"])

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const response = await axios.get(
                    "https://fxnews-b.aistocksagent.com/api/sources"
                )

                const fetched: string[] = response?.data?.data.map(
                    (s: unknown) => String(s)
                )

                setSources(["All Sources", ...fetched])
            } catch (error) {
                console.error("Failed to fetch sources:", error)
            }
        }

        fetchSources()
    }, [])

    return (
        <div className="pb-16 select-none max-mobile:py-10">
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div
                    ref={containerRef}
                    className="bg-white p-1 rounded-full border border-solid border-border-light300 overflow-hidden"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={containerRef}
                        dragElastic={0.05}
                        whileTap={{ cursor: "grabbing" }}
                        className="flex items-center gap-1 w-max px-2 cursor-grab"
                    >
                        {sources.map((source) => (
                            <button
                                key={source}
                                onClick={() => onSourceChange(source)}
                                className={`relative py-2.5 max-mobile:px-4 max-mobile:text-sm px-6 rounded-full border-none text-base font-medium whitespace-nowrap transition-colors z-10 cursor-pointer ${activeTab === source
                                    ? "text-black100"
                                    : "text-black100/60 hover:text-black100"
                                    }`}
                            >
                                {activeTab === source && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}

                                {source}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}