"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RoundIcon = '/assets/images/round.svg';

const faqs = [
    {
        question: "Is IC Markets safe to trade with?",
        answer: "A comprehensive directory to discover and compare 512+ forex brokers and industry service providers. We help traders find the right broker based on spreads, regulation, platforms, and more."
    },
    {
        question: "What is IC Markets minimum deposit?",
        answer: "The minimum deposit for IC Markets is usually around $200, though this can vary depending on the account type and funding method."
    },
    {
        question: "Does IC Markets offer MT4?",
        answer: "Yes, IC Markets offers the popular MetaTrader 4 (MT4) platform along with MetaTrader 5 and cTrader."
    },
    {
        question: "How long does IC Markets withdrawal take?",
        answer: "Withdrawals are typically processed within 24 hours. The actual time to reach your account depends on the payment method."
    },
    {
        question: "Is IC Markets good for beginners?",
        answer: "IC Markets is suitable for beginners as it offers a free demo account, extensive educational resources, and user-friendly platforms."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                        {faqs.map((faq, index) => {
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
