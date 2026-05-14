'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

const CATEGORIES = ['All', 'Forex', 'Crypto', 'Stocks', 'Scam Alerts']
const RISK_LEVELS = ['All', 'Low', 'Medium', 'High']

export default function NewsFilter() {
    const [isOpen, setIsOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isRiskOpen, setIsRiskOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('All')
    const [activeRisk, setActiveRisk] = useState('All')

    return (
        <div className="relative">
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light300 rounded-xl hover:border-primary transition-all duration-300 shadow-sm group"
            >
                <span className="text-base font-medium text-black100 group-hover:text-black100">Filter</span>
                <SlidersHorizontal size={18} className="text-black700 group-hover:text-primary transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay to close when clicking outside */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-[240px] bg-white rounded-xl shadow-2xl border border-border-light200 z-50 overflow-hidden"
                        >
                            <div className="p-3 border-b border-border-light200 bg-white">
                                <h3 className="text-base font-semibold text-black100">Filter</h3>
                            </div>

                            <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
                                {/* Category Section */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 bg-[#f3f4f6] rounded-xl hover:bg-[#e5e7eb] transition-colors"
                                    >
                                        <span className="text-[15px] font-medium text-black100">Category</span>
                                        <motion.div
                                            animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={16} className="text-black700" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden px-1"
                                            >
                                                <div className="py-1 space-y-1">
                                                    {CATEGORIES.map((cat) => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => setActiveCategory(cat)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-[15px] font-medium transition-all ${activeCategory === cat
                                                                ? 'text-primary'
                                                                : 'text-black700 hover:text-black100 hover:bg-zinc-50'
                                                                }`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Risk Level Section */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setIsRiskOpen(!isRiskOpen)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 bg-[#f3f4f6] rounded-xl hover:bg-[#e5e7eb] transition-colors"
                                    >
                                        <span className="text-[15px] font-medium text-black100">Risk Level</span>
                                        <motion.div
                                            animate={{ rotate: isRiskOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={16} className="text-black700" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isRiskOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden px-1"
                                            >
                                                <div className="py-1 space-y-1">
                                                    {RISK_LEVELS.map((risk) => (
                                                        <button
                                                            key={risk}
                                                            onClick={() => setActiveRisk(risk)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-[15px] font-medium transition-all ${activeRisk === risk
                                                                ? 'text-primary'
                                                                : 'text-black700 hover:text-black100 hover:bg-zinc-50'
                                                                }`}
                                                        >
                                                            {risk}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

