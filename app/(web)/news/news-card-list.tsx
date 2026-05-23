"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '~/components/common/button';
import AnalyzeModal from './analyze-modal';
import axios from 'axios';
import Link from 'next/link';
import { EmptyList } from '~/components/web/empty-list';
const UpdateCard = '/assets/images/update-card.png';

export const formatCategory = (category: string) => {
    if (!category) return '';
    return category.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
export const formatPublishedDate = (publishedDate: any) => {
    const date = new Date(publishedDate);
    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    let relativeTime = "";

    if (diffInMinutes < 60) {
        relativeTime = `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
        relativeTime = `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
        relativeTime = `${Math.floor(diffInMinutes / 1440)}d ago`;
    }

    const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return `${relativeTime}.${formattedTime}`;
};

interface NewsCardListProps {
    activeSource: string
}
export default function NewsCardList({ activeSource }: NewsCardListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
   const [news, setNews] = useState<any[]>([])
    const [analyzedResult, setAnalyzedResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [predictionResult, setPredictionResult] = useState<any>(null)
    const [analyzingId, setAnalyzingId] = useState<string | null>(null)
    const itemsPerPage = 21

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true)
            setNews([])
            try {
                const params: Record<string, string | number> = {
                    offset: (currentPage - 1) * itemsPerPage,
                    limit: itemsPerPage
                }
                if (activeSource !== "All Sources") {
                    params.source = activeSource
                }
                const res = await axios.get("https://fxnews-b.aistocksagent.com/api/news", { params })
                setNews(res.data.data)
                setTotalPages(res.data.total_pages || 1)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [activeSource, currentPage])

    const SkeletonCard = () => (
        <div className='border border-[rgba(26,26,26,0.14)] bg-[rgba(255,255,255,0.50)] p-3 rounded-xl animate-pulse'>
            <div className='h-[250px] max-mobile:h-[210px] w-full rounded-xl bg-gray-200' />
            <div className='pt-5 space-y-3'>
                <div className='flex gap-2'>
                    <div className='h-8 w-24 rounded-md bg-gray-200' />
                    <div className='h-8 w-24 rounded-md bg-gray-200' />
                </div>
                <div className='h-4 w-full rounded bg-gray-200' />
                <div className='h-4 w-3/4 rounded bg-gray-200' />
                <div className='h-4 w-full rounded bg-gray-200' />
                <div className='h-4 w-2/3 rounded bg-gray-200' />
                <div className='grid grid-cols-2 gap-3 pt-2'>
                    <div className='h-10 rounded-full bg-gray-200' />
                    <div className='h-10 rounded-full bg-gray-200' />
                </div>
            </div>
        </div>
    )

    const fetchPrediction = async (id: string) => {
        try {
            const predRes = await axios.get(`https://fxnews-b.aistocksagent.com/api/predictions`, { params: { news_id: id } });
            setPredictionResult(predRes.data);
            console.log("predictionResult set to", predRes.data)
        } catch (e) {
            console.log("fetchPrediction error", e)
            setPredictionResult({});
        }
    }
const analyzeNews = async (id: string) => {
    setAnalyzedResult(null);
    setAnalyzingId(id);

    const res = await axios.post(`https://fxnews-b.aistocksagent.com/api/analyze/${id}`);
console.log("analyze response:", res.data)
    // ✅ Patch the specific item in local state immediately
    setNews(prev =>
        prev.map((item: any) =>
            item.id === id
                ? {
                      ...item,
                      analyzed: true,
                      impact_score:res?.data?.data?.core_impact_assessment?.primary_impact_score,
                      impact_duration: item?.impact_duration 
                  }
                : item
        )
    );

    setAnalyzedResult(res.data);
    setAnalyzingId(null);
    setIsModalOpen(true);
    fetchPrediction(id);
};

    const fetchDetails = async (id: string) => {
        setAnalyzedResult(null);
        setIsModalOpen(true)
        const res = await axios.get(`https://fxnews-b.aistocksagent.com/api/news/${id}`);
        setAnalyzedResult(res.data)
        fetchPrediction(id);
    }

    console.log("news", news)
    console.log("analyzedResult", analyzedResult)
                                                
    

    return (
        <div className='pb-[80px] max-mobile:pb-16'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div className='grid grid-cols-3 max-tab:grid-cols-2 max-mobile:grid-cols-1 pb-14 gap-5'>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) :
                        news?.length > 0 ? news.map((item: any, i: number) => {
                            return (
                                <div key={i} onClick={() => item.analyzed && fetchDetails(item.id)} className='border border-[rgba(26,26,26,0.14)] bg-[rgba(255,255,255,0.50)] p-3 rounded-xl cursor-pointer flex flex-col'>

                                    <div className='relative max-mobile:h-[210px] h-[250px] w-full rounded-xl overflow-hidden flex-shrink-0'>
                                        {item.image_url ? (
                                            <img src={item.image_url} alt="UpdateCard" className='block h-full w-full object-cover' />
                                        ) : (
                                            <div className='flex flex-col justify-end h-full w-full bg-gradient-to-b from-[#9a7f8b] via-[#7d6874] to-[#34313d] p-5 relative overflow-hidden'>
                                                <h3 className='text-white text-xl max-mobile:text-lg font-bold leading-tight line-clamp-3 relative z-10'>
                                                    {item.title || 'Market outlook'}
                                                </h3>
                                            </div>
                                        )}
                                        <div className='absolute top-4 max-mobile:top-3 max-mobile:left-3 max-mobile:text-xs left-4 bg-[rgba(26,26,26,0.8)] backdrop-blur-sm text-white text-sm font-medium py-1.5 px-4 rounded-full z-20'>
                                            {item.site || item.source || 'News'}
                                        </div>
                                    </div>
                                    <div className='pt-5 flex flex-col flex-1'>
                                        <div className='flex items-center justify-between gap-2 pb-4'>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                <Button className='text-[#2AA411] rounded-md bg-[rgba(42,164,17,0.10)] text-sm py-1.5 px-3 font-medium'>
                                                    {formatCategory(item?.news_category)}
                                                </Button>
                                                <button className='text-black100 rounded-md  bg-[rgba(26,26,26,0.10)] text-sm py-1.5 px-3 font-medium'>
                                                    Latest News
                                                </button>
                                            </div>
                                            {/* <button className='text-black100 whitespace-nowrap rounded-md bg-primary text-sm py-1.5 px-3 font-medium'>
                                                Regulatory Policy
                                            </button> */}
                                        </div>
                                        <h3 className='text-base font-medium text-black100 line-clamp-3 mb-2'>
                                            {item?.title || `The latest war between Israel and Hamas, and the closure of the Strait of Hormuz, have sent economic shock waves
                                            across the Mideast.`}
                                        </h3>
                                        <p className='text-base text-black700 font-normal line-clamp-2 mb-3'>
                                            {item?.description || `The latest war between Israel and Hamas, and the closure of the Strait of Hormuz, have sent economic shock
                                            waves across the Mideast.`}
                                        </p>
                                        <div className='flex gap-3 mb-3'>
                                            <p className="text-sm text-black100">
                                                Published :{" "}
                                                <span className="text-black700 font-medium">
                                                    {formatPublishedDate(item?.published)}
                                                </span>
                                            </p>
                                            <div className='w-[1px] h-[17px] bg-[rgba(26,26,26,0.14)]'></div>
                                            <p className="text-sm text-black100">
                                                Posted :{" "}
                                                <span className="text-black700 font-medium">
                                                    {formatPublishedDate(item?.created_at)}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-3 pt-2 mt-auto'>
                                            <Link href={item.link} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                <Button size="md" variant="primary" className="px-5 gap-2.5 group relative z-[9]">
                                                    Read Now
                                                    <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M2.9169 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </Button>
                                            </Link>
                                            <Button
                                                size="md"
                                                variant="primary"

                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!item.analyzed && analyzingId !== item.id) analyzeNews(item.id);
                                                    else if (item.analyzed) fetchDetails(item.id)
                                                }}
                                                disabled={analyzingId === item.id}
                                                className={`px-5 max-mobile:px-3 max-mobile:gap-1.5 gap-2.5 group rounded-full relative z-[9] border transition-all hover:bg-white text-black100 border-[rgba(26,26,26,0.10)] bg-[#F0F1EC]`}
                                            >
                                                {analyzingId === item.id ? 'Analyzing' : item.analyzed ? item?.impact_score + "/10 " + formatCategory(item?.impact_duration?.split(/[-_]/)[0]) + " Impact" : 'Analyze'}
                                                <div className={`w-7 h-7 max-mobile:w-6 max-mobile:h-6 rounded-full flex items-center justify-center transition-all duration-300
                                                    ${item.analyzed ? 'bg-black100/40' : 'bg-black100 group-hover:bg-primary'}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M11.4287 2.00001C10.1778 1.99917 8.95263 2.3557 7.89749 3.02763C6.84235 3.69956 6.00112 4.65893 5.47281 5.79282C4.94449 6.92671 4.75109 8.18792 4.91537 9.42801C5.07964 10.6681 5.59475 11.8355 6.40007 12.7927L2.17145 17.0242C2.11836 17.0772 2.07624 17.1402 2.04749 17.2095C2.01874 17.2789 2.00393 17.3532 2.00391 17.4282C2.00388 17.5033 2.01864 17.5776 2.04734 17.647C2.07603 17.7163 2.11811 17.7794 2.17117 17.8325C2.22422 17.8855 2.28721 17.9277 2.35655 17.9564C2.42588 17.9852 2.5002 18 2.57525 18C2.65031 18 2.72464 17.9853 2.79399 17.9566C2.86335 17.9279 2.92637 17.8858 2.97946 17.8327L7.20693 13.6001C8.0159 14.2807 8.97711 14.7561 10.009 14.9859C11.0409 15.2157 12.113 15.1931 13.1343 14.9201C14.1556 14.6472 15.096 14.1318 15.8756 13.4178C16.6553 12.7039 17.2512 11.8123 17.6127 10.8189C17.9743 9.8255 18.0908 8.75951 17.9524 7.71144C17.8141 6.66337 17.4249 5.66414 16.818 4.79858C16.211 3.93301 15.4042 3.22665 14.466 2.73945C13.5278 2.25225 12.4859 1.99859 11.4287 2.00001ZM11.4287 14.0001C10.355 14.0001 9.30544 13.6817 8.41271 13.0852C7.51997 12.4887 6.82417 11.6409 6.41329 10.6489C6.00241 9.657 5.89491 8.56548 6.10437 7.51243C6.31384 6.45938 6.83086 5.49209 7.59007 4.73288C8.34928 3.97368 9.31657 3.45665 10.3696 3.24718C11.4227 3.03772 12.5142 3.14522 13.5061 3.5561C14.4981 3.96698 15.3459 4.66279 15.9424 5.55552C16.5389 6.44825 16.8573 7.49782 16.8573 8.5715C16.8557 10.0108 16.2832 11.3906 15.2655 12.4083C14.2478 13.426 12.8679 13.9985 11.4287 14.0001ZM12.0001 6.28576V10.8572C12.0001 11.0088 11.9399 11.1541 11.8328 11.2613C11.7256 11.3685 11.5802 11.4287 11.4287 11.4287C11.2771 11.4287 11.1318 11.3685 11.0246 11.2613C10.9175 11.1541 10.8573 11.0088 10.8573 10.8572V6.28576C10.8573 6.13421 10.9175 5.98886 11.0246 5.8817C11.1318 5.77453 11.2771 5.71433 11.4287 5.71433C11.5802 5.71433 11.7256 5.77453 11.8328 5.8817C11.9399 5.98886 12.0001 6.13421 12.0001 6.28576ZM9.71439 7.42863V10.8572C9.71439 11.0088 9.65418 11.1541 9.54702 11.2613C9.43985 11.3685 9.29451 11.4287 9.14295 11.4287C8.9914 11.4287 8.84605 11.3685 8.73889 11.2613C8.63172 11.1541 8.57152 11.0088 8.57152 10.8572V7.42863C8.57152 7.27708 8.63172 7.13173 8.73889 7.02457C8.84605 6.9174 8.9914 6.8572 9.14295 6.8572C9.29451 6.8572 9.43985 6.9174 9.54702 7.02457C9.65418 7.13173 9.71439 7.27708 9.71439 7.42863ZM14.2859 8.5715V10.8572C14.2859 11.0088 14.2257 11.1541 14.1185 11.2613C14.0113 11.3685 13.866 11.4287 13.7144 11.4287C13.5629 11.4287 13.4175 11.3685 13.3104 11.2613C13.2032 11.1541 13.143 11.0088 13.143 10.8572V8.5715C13.143 8.41995 13.2032 8.2746 13.3104 8.16744C13.4175 8.06027 13.5629 8.00007 13.7144 8.00007C13.866 8.00007 14.0113 8.06027 14.1185 8.16744C14.2257 8.2746 14.2859 8.41995 14.2859 8.5715Z" fill="white" />
                                                    </svg>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                            : (
                               
  <div className='col-span-full flex items-center justify-center min-h-[400px]'>
    <div className='w-full max-w-[500px]'>
      <EmptyList>No News Available</EmptyList>
    </div>
  </div>

                            )
                    }
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 md:mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 md:px-5 cursor-pointer py-2 md:py-2.5 bg-white border border-solid border-border-light300 rounded-full text-black700 text-sm md:text-base font-medium hover:bg-primary hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-none"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Previous
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 order-3 sm:order-none w-full sm:w-auto mt-2 sm:mt-0">
                        {(() => {
                            const pages: (number | '...')[] = [];
                            if (totalPages <= 7) {
                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                                pages.push(1);
                                if (currentPage > 4) pages.push('...');
                                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                    pages.push(i);
                                }
                                if (currentPage < totalPages - 3) pages.push('...');
                                pages.push(totalPages);
                            }
                            return pages.map((p, i) =>
                                p === '...'
                                    ? <span key={`ellipsis-${i}`} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-black700 font-medium">...</span>
                                    : <button
                                        key={p}
                                        onClick={() => setCurrentPage(p as number)}
                                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-medium transition-all text-sm md:text-base
                                            ${currentPage === p
                                                ? 'bg-primary text-black100 font-bold md:text-lg shadow-sm'
                                                : 'bg-white border border-solid border-border-light300 text-black700 hover:bg-primary hover:border-primary'
                                            }`}
                                    >
                                        {p}
                                    </button>
                            );
                        })()}
                    </div>

                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 md:px-5 cursor-pointer py-2 md:py-2.5 bg-white border border-solid border-border-light300 rounded-full text-black700 text-sm md:text-base font-medium hover:bg-primary hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed order-2 sm:order-none"
                    >
                        Next
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
            <AnalyzeModal isOpen={isModalOpen} predictionResult={predictionResult} onClose={() => setIsModalOpen(false)} analyzedResult={analyzedResult} />
        </div>
    )
}