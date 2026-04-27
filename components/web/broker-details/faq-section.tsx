"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RoundIcon = '/assets/images/round.svg';


export default function FaqSection({ broker }: { broker: any }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = broker?.faqs || [];

    if (faqs.length === 0) return null;

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        
        <div id='faq' className='rounded-xl border scroll-mt-20 border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    FAQ
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                    <div className='flex items-center gap-2 pb-3'>
                        <img src={RoundIcon} alt="RoundIcon" className='block' />
                        <span className='block text-base font-medium text-black'>
                            Frequently asked questions
                        </span>
                    </div>
                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                    <div className='pt-4 flex flex-col gap-2'>
                        {faqs.map((faq: any, index: number) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border-light300 bg-white overflow-hidden cursor-pointer transition-colors duration-200"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="flex justify-between items-center p-3">
                                        <h4 className="text-base font-medium text-black100">
                                            {faq.question}
                                        </h4>
                                        <div className="shrink-0 ml-3">
                                            {isOpen ? (
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="11" stroke="#A8DD15" strokeWidth="1.5" />
                                                    <path d="M8 12H16" stroke="#A8DD15" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            ) : (
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="11" stroke="#333333" strokeWidth="1.5" />
                                                    <path d="M12 8V16M8 12H16" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <div className="px-4 pb-5 pt-1 text-[15px] leading-[1.6] text-black700">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
