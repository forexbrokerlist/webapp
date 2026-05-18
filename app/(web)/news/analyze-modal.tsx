"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/common/button'
import SearchIcon from '~/components/common/icons/searchIcon';
import Overview from './overview';
import Directional from './directional';
import ScenarioRisk from './scenario-risk';
import Suggestions from './suggestions';
import Predictions from './predictions';

const UpdateCard = '/assets/images/update-card.png';

interface AnalyzeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AnalyzeModal({ isOpen, onClose }: AnalyzeModalProps) {
    const [activeTab, setActiveTab] = React.useState("Overview")
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{ scrollbarWidth: 'none' }}
                    className="relative bg-white w-full max-w-[850px] max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl no-scrollbar"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[999] w-9 rounded-full h-9 flex items-center justify-center bg-primary "
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="p-5">
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-6">
                            <img src={UpdateCard} alt="Analyze" className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-medium">
                                AP News
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-[#2AA411] bg-[#2AA411]/10 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#2AA411]"></span>
                                Market Update
                            </span>
                            <span className="text-black100 bg-black100/10 px-3 py-1.5 rounded-md text-sm font-medium">Latest News</span>
                            <span className="ml-auto text-black100 bg-primary px-3 py-1.5 rounded-md text-sm font-medium">Regulatory Policy</span>
                        </div>

                        <h2 className="text-xl font-bold text-black100 mb-3 leading-tight">
                            The Latest War Between Israel And Hamas, And The Closure Of The Strait Of Hormuz, Have Sent Economic Shock Waves Across The Mideast.
                        </h2>
                        <p className="text-black700 text-base mb-4 leading-relaxed">
                            The latest war between Israel and Hamas, and the closure of the Strait of Hormuz, have sent economic shock waves across the Mideast. Market participants should expect heightened volatility.
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-black700 mb-4 pb-4 border-b border-black100/10">
                            <span>Source Posted : <span className="font-medium text-black100">2h ago - 05:36 AM</span></span>
                            <span>Scraped : <span className="font-medium text-black100">2h ago - 09:43 AM</span></span>
                        </div>

                        <div className="bg-[#F0F1EC] p-4 rounded-xl mb-4">
                            <p className="text-black700 text-sm">
                                <span className="font-bold text-black100">Reason :</span> The closure of the Strait of Hormuz is a major disruption to global oil shipping routes that will significantly impact energy prices.
                            </p>
                        </div>
                        <div className='flex items-center justify-between pb-4'>
                            <button className='py-1 px-3 text-base font-medium text-[#2AA411] flex items-center gap-2 rounded-[6px] bg-[rgba(42,164,17,0.10)]'>
                                <SearchIcon />
                                Analyze
                            </button>
                            <div className='flex items-center gap-2.5'>
                                <button className='py-1.5 px-3 text-black100 text-base rounded-md bg-[rgba(26,26,26,0.10)] border-none'>
                                    supply_chain-disruption
                                </button>
                                <button className='py-1.5 px-3 text-black100 text-base rounded-md bg-[rgba(26,26,26,0.10)] border-none'>
                                    Escalation
                                </button>
                            </div>
                        </div>
                        <div className='grid grid-cols-[46px_1fr] gap-3 pt-1 pb-5'>
                            <div className='w-[46px] text-xl text-[#E20808] font-semibold h-[46px] rounded-full bg-[#FFEBEB] flex items-center justify-center'>
                                8
                            </div>
                            <div>
                                <p className='text-lg font-semibold text-black100'>
                                    High Impact
                                </p>
                                <span className='block text-sm text-black700 font-medium'>
                                    Out of 10
                                </span>
                            </div>
                        </div>
                        <div className='border border-solid border-border-light300 p-1 rounded-full flex justify-between items-center gap-1 overflow-x-auto scrollbar-none mb-6'>
                            {["Overview", "Directional bias", "Insights", "Suggestions", "Predictions"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative py-2 px-8 rounded-full text-base font-medium transition-colors z-10 whitespace-nowrap ${activeTab === tab ? 'text-black100' : 'text-black700 hover:text-black100'
                                        }`}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeModalTab"
                                            className="absolute inset-0 bg-primary rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === "Overview" && (
                                    <>
                                        <Overview />
                                    </>
                                )}

                                {
                                    activeTab === "Directional bias" && <Directional />
                                }
                                {
                                    activeTab === "Insights" && <ScenarioRisk />
                                }
                                {
                                    activeTab === "Suggestions" && <Suggestions />
                                }
                                {
                                    activeTab === "Predictions" && <Predictions />
                                }


                            </motion.div>
                        </AnimatePresence>

                        <Button size="md" variant="primary" className="px-5 mt-3 w-full gap-2.5 group relative z-[9]">
                            Read Full Article
                            <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

