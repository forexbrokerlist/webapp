'use client';
import React from 'react'
import { motion } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import { Button } from '~/components/common/button';
import Link from 'next/link';

export default function OurPartners({ liquidityPartners, PSPPartners, TradingPalformPartners }: { liquidityPartners: any[], PSPPartners: any[], TradingPalformPartners: any[] }) {
    return (
        <div className='pt-100 overflow-hidden max-mobile:pt-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <motion.div
                    className='pb-12 max-mobile:pb-8'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold font-monda'>
                       Our Trusted Forex Industry Partners
                    </h2>
                    <p className='text-lg max-mobile:text-base
                     text-black700 text-center mx-auto font-medium max-w-[650px]'>
                      Supported by top forex industry partners, liquidity, platforms, payments &  broker tech.
                    </p>
                </motion.div>
                <div className='grid grid-cols-2 gap-5 max-tab:grid-cols-1'>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className='rounded-[20px] max-mobile:rounded-xl max-mobile:p-4 border border-[rgba(26,26,26,0.08)] bg-white p-6'
                        >
                            <div className='flex items-center justify-between pb-6 max-mobile:block'>
                                <div>
                                    <h3 className='text-3xl max-mobile:text-2xl max-mobile:leading-8 text-black100 font-bold  mb-2'>
                                        Liquidity Partners
                                    </h3>
                                    <p className='text-base font-medium text-black700  max-w-[480px] '>
                                        Providing deep liquidity and institutional-grade execution for brokers and financial institutions.
                                    </p>
                                </div>
                                <div className='max-mobile:pt-4'>
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        <Link href="/categories/liquidity-partners">
                                        View More
                                        <div>
                                            <MoveRight />
                                        </div>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <motion.div
                                className='grid grid-cols-2 gap-3 max-mobile:grid-cols-1'
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                                    }
                                }}
                            >
                                {
                                    liquidityPartners.map((partner, index) => {
                                        return (
                                            <motion.div
                                                key={partner.id}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                                }}
                                                whileHover={{ y: -8 }}
                                                className='rounded-xl bg-[#F4F4F4] p-2'
                                            >
                                                <div className='p-2.5 rounded-xl border border-[rgba(26,26,26,0.14)] bg-white h-full flex flex-col'>
                                                    <div className='grid grid-cols-[80px_1fr] items-center gap-3 pb-4 border-b border-solid border-border-gray800'>
                                                        <div className='h-[54px] w-full bg-[#F4F4F4] rounded-lg flex items-center justify-center overflow-hidden p-2'>
                                                            <img src={partner.logoUrl} alt={partner.name} className='block max-h-full w-auto object-contain' />
                                                        </div>
                                                        <div>
                                                            <h3 className='text-base text-black font-semibold truncate'>
                                                                {partner.name}
                                                            </h3>
                                                            <p className='text-xs text-black700 font-medium truncate'>
                                                                {partner.title }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='pt-4 flex-1'>
                                                        <p className="text-xs text-black700 line-clamp-3">
                                                            {partner.description}
                                                        </p>
                                                    </div>
                                                    <div className='pt-3 mt-auto'>
                                                        <Button size="md" variant="primary" className="px-5 gap-2.5 py-1.5 w-full justify-center text-xs group">
                                                           <Link href={`/brokers/${partner.slug}`}>
                                                            Learn More
                                                            <div className="w-4 h-4 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                                    <path d="M6.12793 2.51855L8.70573 5.09636L6.12793 7.67416" stroke="#1A1A1A" strokeWidth="0.637019" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M1.48633 5.0957H8.63368" stroke="#1A1A1A" strokeWidth="0.637019" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                }
                                {liquidityPartners.length === 0 && (
                                    <div className="col-span-full py-10 text-center text-black400 border border-dashed rounded-xl">
                                        No liquidity partners found.
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
 
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className='rounded-[20px] mt-5 border border-[rgba(26,26,26,0.08)] bg-white '
                        >
                            <div className='flex items-center justify-between p-6'>
                                <div>
                                    <h3 className='text-3xl text-black100 font-bold  mb-2'>
                                        Trading Platform Partners
                                    </h3>
                                    <p className='text-base font-medium text-black700  max-w-[480px] '>
                                        Connect with trusted trading platforms and automate your strategies with powerful tools
                                    </p>
                                </div>
                                <div>
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        <Link href="/categories/trading-platform-partners"> 
                                        View More
                                        <div>
                                            <MoveRight />
                                        </div>
                                        </Link> 
                                    </Button>
                                </div>
                            </div>
                            <motion.div
                                className='px-[50px] max-laptop:px-5 pb-10'
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05, delayChildren: 0.3 }
                                    }
                                }}
                            >
                                <div className="grid grid-cols-5 gap-4 max-mobile:grid-cols-2">
                                    {
                                        TradingPalformPartners.map((partner, index) => {
                                            return (
                                                <motion.div
                                                    key={partner.id}
                                                    variants={{
                                                        hidden: { opacity: 0, scale: 0.8 },
                                                        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                                    }}
                                                    whileHover={{ y: -5, scale: 1.05 }}
                                                    className="px-5 py-4 rounded-[12px] border border-[rgba(26,26,26,0.16)] bg-[rgba(255,255,255,0.1)] backdrop-blur-[87.7px] shadow-sm flex flex-col items-center justify-center"
                                                >
                                                    <div className='flex justify-center h-12 w-full'>
                                                        <img className='block max-h-full w-auto object-contain' src={partner.logoUrl} alt={partner.name} />
                                                    </div>
                                                    <p className='mt-3 text-sm max-laptop:mt-2 text-black700 text-center font-medium w-full'>
                                                        {partner.name}
                                                    </p>
                                                </motion.div>
                                            )
                                        })
                                    }
                                    {TradingPalformPartners.length === 0 && (
                                        <div className="col-span-full py-4 text-center text-black400 text-sm">
                                            No trading platforms found.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
 
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                        className='rounded-[20px] border max-mobile:rounded-xl max-mobile:p-4 border-[rgba(26,26,26,0.08)] bg-white overflow-hidden flex flex-col'
                    >
                        <div className='p-10 pb-6 max-mobile:p-4'>
                            <h3 className='text-3xl max-mobile:text-2xl max-mobile:leading-8 text-black100 font-bold text-center mb-1'>
                                PSP Partners
                            </h3>
                            <p className='text-base font-medium text-black700 text-center max-w-[650px] mx-auto'>
                              Explore trusted payment solution providers for forex brokers supporting fast, secure 
deposits and withdrawals for traders worldwide.

                            </p>
                        </div>
                        <motion.div
                            className='flex-1 flex flex-col'
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            {/* Row 1 — first 4 partners */}
                            {(() => { const row1 = PSPPartners.slice(0, 4); const row1Loop = [...row1, ...row1]; return (
                            <div className='flex w-full overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {row1Loop.map((partner, index) => (
                                            <div key={`row1-${partner.id}-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] max-mobile:max-w-[200px] max-mobile:w-[200px] max-mobile:min-w-[200px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] max-mobile:h-[60px] flex items-center justify-center bg-white p-4'>
                                                    <img src={partner.logoUrl} alt={partner.name} className='block max-h-full w-auto object-contain' />
                                                </div>
                                            </div>
                                        ))}
                                        {row1.length === 0 && [...Array(5)].map((_, i) => (
                                            <div key={`placeholder1-${i}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 w-[300px] min-w-[300px] h-[106px] animate-pulse' />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                            ); })()}
 
                            {/* Row 2 — next 4 partners */}
                            {(() => { const row2 = PSPPartners.slice(4, 8); const row2Loop = [...row2, ...row2]; return (
                            <div className='flex w-full overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['-50%', '0%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {row2Loop.map((partner, index) => (
                                            <div key={`row2-${partner.id}-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] max-mobile:max-w-[200px] max-mobile:w-[200px] max-mobile:min-w-[200px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] max-mobile:h-[60px] flex items-center justify-center bg-white p-4'>
                                                    <img src={partner.logoUrl} alt={partner.name} className='block max-h-full w-auto object-contain' />
                                                </div>
                                            </div>
                                        ))}
                                        {row2.length === 0 && [...Array(5)].map((_, i) => (
                                            <div key={`placeholder2-${i}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 w-[300px] min-w-[300px] h-[106px] animate-pulse' />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                            ); })()}
 
                            {/* Row 3 — last 4 partners (Hidden on mobile) */}
                            {(() => { const row3 = PSPPartners.slice(8, 12); const row3Loop = [...row3, ...row3]; return (
                            <div className='flex w-full max-mobile:hidden overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {row3Loop.map((partner, index) => (
                                            <div key={`row3-${partner.id}-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] flex items-center justify-center bg-white p-4'>
                                                    <img src={partner.logoUrl} alt={partner.name} className='block max-h-full w-auto object-contain' />
                                                </div>
                                            </div>
                                        ))}
                                        {row3.length === 0 && [...Array(5)].map((_, i) => (
                                            <div key={`placeholder3-${i}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 w-[300px] min-w-[300px] h-[106px] animate-pulse' />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                            ); })()}
                        </motion.div>
                        <div className='flex justify-center pt-5 max-mobile:pb-4 pb-10 mt-auto'>
                            <Button variant='primary' size='md' className='flex items-center gap-2'>
                                <Link href="categories/psp-partners">
                                View More
                                <div>
                                    <MoveRight />
                                </div>
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
