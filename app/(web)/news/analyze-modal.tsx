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
import { formatCategory, formatPublishedDate } from './news-card-list'
import Link from 'next/link';

interface AnalyzeModalProps {
    isOpen: boolean
    onClose: () => void
    analyzedResult: any
    predictionResult: any
}

export default function AnalyzeModal({ isOpen, onClose, analyzedResult, predictionResult }: AnalyzeModalProps) {
    const [activeTab, setActiveTab] = React.useState("Overview")

    const hasDirectionalBias = React.useMemo(() => {
        const bias = analyzedResult?.data?.directional_bias
        if (!bias) return false
        return (
            (bias.forex?.length > 0) ||
            (bias.crypto?.length > 0) ||
            (bias.global_equities?.length > 0)
        )
    }, [analyzedResult])

    const tabs = React.useMemo(() => [
        "Overview",
        "Directional bias",
        "Insights",
        "Suggestions",
        ...(predictionResult?.data?.length > 0 ? ["Predictions"] : [])
    ], [predictionResult, hasDirectionalBias])

    React.useEffect(() => {
        if (isOpen) setActiveTab("Overview")
    }, [isOpen])

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
                        className="absolute top-4 right-4 z-[999] w-9 rounded-full h-9 flex items-center justify-center bg-primary"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="p-4 md:p-5">
                        {!analyzedResult ? (
                            <div className="animate-pulse">
                                <div className="h-[250px] md:h-[400px] w-full rounded-2xl bg-gray-200 mb-6" />
                                <div className="flex gap-2 mb-4">
                                    <div className="h-8 w-24 rounded-md bg-gray-200" />
                                    <div className="h-8 w-24 rounded-md bg-gray-200" />
                                </div>
                                <div className="h-6 w-3/4 rounded bg-gray-200 mb-3" />
                                <div className="h-4 w-full rounded bg-gray-200 mb-2" />
                                <div className="h-4 w-5/6 rounded bg-gray-200 mb-6" />
                                <div className="h-[1px] w-full bg-gray-200 mb-4" />
                                <div className="h-16 w-full rounded-xl bg-gray-200 mb-4" />
                                <div className="flex flex-wrap justify-between gap-4 mb-5">
                                    <div className="h-8 w-24 rounded-md bg-gray-200" />
                                    <div className="flex flex-wrap gap-2">
                                        <div className="h-8 w-32 rounded-md bg-gray-200" />
                                        <div className="h-8 w-24 rounded-md bg-gray-200" />
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-5">
                                    <div className="w-[46px] h-[46px] rounded-full bg-gray-200" />
                                    <div className="flex flex-col gap-2 justify-center">
                                        <div className="h-5 w-32 rounded bg-gray-200" />
                                        <div className="h-4 w-16 rounded bg-gray-200" />
                                    </div>
                                </div>
                                <div className="h-12 w-full rounded-full bg-gray-200 mb-6" />
                                <div className="h-40 w-full rounded-xl bg-gray-200" />
                            </div>
                        ) : (
                            <>
                                <div className="relative h-[250px] md:h-[400px] w-full rounded-2xl overflow-hidden mb-6">
                                    {analyzedResult?.data?.image_url ? (
                                        <img
                                            src={analyzedResult?.data?.image_url}
                                            alt="Analyze"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col justify-end h-full w-full bg-gradient-to-b from-[#9a7f8b] via-[#7d6874] to-[#34313d] p-4 md:p-5 relative overflow-hidden">
                                            <h3 className="text-white text-xl font-bold leading-tight line-clamp-3 relative z-10">
                                                {analyzedResult?.data?.event_metadata?.title || 'Market outlook'}
                                            </h3>
                                        </div>
                                    )}
                                    {analyzedResult?.data?.event_metadata?.source && (
                                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-medium">
                                            {analyzedResult?.data?.event_metadata?.source}
                                        </div>
                                    )}

                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="text-[#2AA411] bg-[#2AA411]/10 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#2AA411]"></span>
                                        {formatCategory(analyzedResult?.article?.news_category)}
                                    </span>
                                    <span className="text-black100 bg-black100/10 px-3 py-1.5 rounded-md text-sm font-medium">Latest News</span>
                                    <span className="md:ml-auto text-black100 bg-primary px-3 py-1.5 rounded-md text-sm font-medium">Regulatory Policy</span>
                                </div>

                                <h2 className="text-xl font-bold text-black100 mb-3 leading-tight">
                                    {analyzedResult?.data?.event_metadata?.title}
                                </h2>
                                <p className="text-black700 text-base mb-4 leading-relaxed">
                                    {analyzedResult?.data?.event_metadata?.summary}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm text-black700 mb-4 pb-4 border-b border-black100/10">
                                    <span>Source Posted : <span className="font-medium text-black100">{formatPublishedDate(analyzedResult?.article?.published)}</span></span>
                                    <span>Scraped : <span className="font-medium text-black100">{formatPublishedDate(analyzedResult?.article?.created_at)}</span></span>
                                </div>

                                <div className="bg-[#F0F1EC] p-4 rounded-xl mb-4">
                                    <p className="text-black700 text-sm">
                                        <span className="font-bold text-black100">Reason :</span>{analyzedResult?.article?.news_reason}
                                    </p>
                                </div>

                                <div className='flex flex-wrap items-center justify-between gap-4 pb-4'>
                                    <button className='py-1 px-3 text-sm md:text-base font-medium text-[#2AA411] flex items-center gap-2 rounded-[6px] bg-[rgba(42,164,17,0.10)] shrink-0'>
                                        <SearchIcon />
                                        Analyze
                                    </button>
                                    <div className='flex flex-wrap items-center gap-2.5'>
                                        <button className='py-1.5 px-3 text-black100 text-sm md:text-base rounded-md bg-[rgba(26,26,26,0.10)] border-none'>
                                            {analyzedResult?.data?.event_classification?.shock_type}
                                        </button>
                                        <button className='py-1.5 px-3 text-black100 text-sm md:text-base rounded-md bg-[rgba(26,26,26,0.10)] border-none'>
                                            {analyzedResult?.article?.market_mode?.toLowerCase()}
                                        </button>
                                        <button className='py-1.5 px-3 text-black100 text-sm md:text-base rounded-md bg-[rgba(26,26,26,0.10)] border-none'>
                                            Conf: {analyzedResult?.article?.confidence}/100
                                        </button>
                                    </div>
                                </div>

                                <div className='grid grid-cols-[46px_1fr] gap-3 pt-1 pb-5'>
                                    <div className='w-[46px] text-xl text-[#E20808] font-semibold h-[46px] rounded-full bg-[#FFEBEB] flex items-center justify-center'>
                                        {analyzedResult?.article?.impact_score}
                                    </div>
                                    <div>
                                        <p className='text-lg font-semibold text-black100'>
                                            {formatCategory(analyzedResult?.data?.time_modeling?.impact_duration)} Impact
                                        </p>
                                        <span className='block text-sm text-black700 font-medium'>
                                            Out of 10
                                        </span>
                                    </div>
                                </div>

                                <div className='border border-solid border-border-light300 p-1 rounded-full flex justify-start md:justify-between items-center gap-1 overflow-x-auto scrollbar-none mb-6'>
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative py-2 px-8 rounded-full text-base font-medium transition-colors z-10 whitespace-nowrap ${activeTab === tab ? 'text-black100' : 'text-black700 hover:text-black100'}`}
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
                                        {activeTab === "Overview" && <Overview analyzedResult={analyzedResult} />}
                                        {activeTab === "Directional bias" && <Directional analyzedResult={analyzedResult} />}
                                        {activeTab === "Insights" && <ScenarioRisk analyzedResult={analyzedResult} />}
                                        {activeTab === "Suggestions" && <Suggestions analyzedResult={analyzedResult} />}
                                        {activeTab === "Predictions" && predictionResult?.data?.length > 0 && <Predictions predictionResult={predictionResult} />}
                                    </motion.div>
                                </AnimatePresence>

                                <Link href={analyzedResult?.article?.link ?? ""} target="_blank">
                                    <Button size="md" variant="primary" className="px-5 mt-3 w-full gap-2.5 group relative z-[9]">
                                        Read Full Article
                                        <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}