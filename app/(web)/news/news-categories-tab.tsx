"use client"
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const sources = [
    "All Sources",
    "Al Jazeera",
    "AP News",
    "BBC News",
    "Bitcoinmagazine.com",
    "CNBC",
    "cnbc.com",
    "Coindesk.com",
    "Cointelegraph.com",
    "Cryptopotato.com",
    "Federalreserve.gov",
    "Feeds.bloomberg"
]

export default function NewsCategoriesTab() {
    const [activeTab, setActiveTab] = useState("All Sources")
    const [constraints, setConstraints] = useState({ left: 0, right: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateConstraints = () => {
            if (containerRef.current && innerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const innerWidth = innerRef.current.scrollWidth
                const leftConstraint = Math.min(0, -(innerWidth - containerWidth + 16)) // Added some padding
                setConstraints({ left: leftConstraint, right: 0 })
            }
        }

        updateConstraints()
        window.addEventListener('resize', updateConstraints)
        return () => window.removeEventListener('resize', updateConstraints)
    }, [])

    return (
        <div className="pb-16 select-none">
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div
                    ref={containerRef}
                    className='bg-white p-1 rounded-full border border-solid border-border-light300 overflow-hidden'
                >
                    <motion.div
                        ref={innerRef}
                        drag="x"
                        dragConstraints={constraints}
                        dragElastic={0.1}
                        className='flex items-center gap-1 cursor-grab active:cursor-grabbing w-max px-2'
                    >
                        {sources.map((source) => (
                            <button
                                key={source}
                                onClick={() => setActiveTab(source)}
                                className={`relative py-2.5 cursor-pointer rounded-full px-6 border-none text-base font-medium transition-colors whitespace-nowrap z-10 ${activeTab === source ? 'text-black100' : 'text-black100/60 hover:text-black100'
                                    }`}
                            >
                                {activeTab === source && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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


