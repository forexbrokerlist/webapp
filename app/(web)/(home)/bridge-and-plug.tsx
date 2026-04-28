"use client"

import { MoveRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/common/button'
import CheckIcon from '~/components/common/icons/check-icon'
import { motion } from 'framer-motion'
import { Favicon } from '~/components/web/ui/favicon'
import Link from 'next/link'

interface Partner {
    id: string;
    name: string;
    title: string | null;
    description: string | null;
    logoUrl: string;
    features: string[];
    highlightedPoint: string | null;
    socialProof: string | null;
    slug: string | null
}

interface BridgeAndPlugProps {
    partners?: Partner[];
    title: string;
    description: string;
    category?: any;
}

export default function BidgeAndPlug({ partners = [], title, description, category }: BridgeAndPlugProps) {
    return (
        <div className='py-100 max-mobile:py-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8'>
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px] whitespace-pre-line'
                        >
                            {description}
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className='max-mobile:pt-4'
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    >
                        <Button variant='primary' size='md' className='flex items-center gap-2'>
                            <Link href={`/categories/${category?.slug || 'forex-bridge-providers'}`}>
                                Explore All

                                <div>
                                    <MoveRight />
                                </div>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                <motion.div
                    className='grid grid-cols-3 max-mobile:grid-cols-1 max-mobile:gap-8 max-tab:grid-cols-2 max-tab:gap-6 gap-6 max-laptop:gap-6'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                >
                    {
                        partners.map((partner) => {
                            return (
                                <motion.div
                                    key={partner.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                    }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className='rounded-[16px] max-laptop:p-4 max-laptop:rounded-xl relative px-5 py-7 bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.04)]'
                                >
                                    <div className='bg-[#f0f2ec] w-[128px] h-[128px] rounded-full absolute -right-[26px] -top-[26px] flex items-center justify-center pointer-events-none'>
                                        <div className='w-[97px] h-[97px] bg-white rounded-full flex items-center justify-center shadow-[0_2px_15px_rgba(0,0,0,0.05)] pointer-events-auto border-[0.5px] border-gray-100 overflow-hidden p-3'>
                                            <Favicon src={partner.logoUrl} title={partner.name} size={128} contained={false} className="!size-auto max-w-full max-h-full object-contain mix-blend-normal" />
                                        </div>
                                    </div>
                                    <div className='w-fit text-[11px] text-black700 font-medium px-2.5 py-[3px] rounded-full bg-[#f4f5f0] relative z-10'>
                                        {partner.highlightedPoint || 'Technology Partner'}
                                    </div>
                                    <h3 className='text-2xl font-semibold text-black mt-2'>
                                        {partner.name}
                                    </h3>
                                    <p className='text-base text-black700 font-medium mb-5 line-clamp-2 min-h-[48px]'>
                                        {partner.description || 'Professional trading infrastructure and bridge solutions.'}
                                    </p>
                                    <ul className='flex flex-col gap-4 pb-5'>
                                        {(partner.features?.length > 0 ? partner.features : ["Real-time trade execution", "Advanced risk management"]).slice(0, 2).map((feature, i) => (
                                            <li key={i} className='flex items-center gap-3 text-base text-black700 font-medium'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M0.667672 9.7467L13.037 11.12L11.957 12.9668C11.6293 13.5293 12.3369 14.1181 12.8304 13.6955L17.7965 9.4392C17.8596 9.38499 17.9103 9.31778 17.945 9.24219C17.9797 9.16659 17.9977 9.08439 17.9977 9.0012C17.9977 8.91802 17.9797 8.83581 17.945 8.76022C17.9103 8.68462 17.8596 8.61742 17.7965 8.5632L12.8304 4.30695C12.3365 3.88208 11.6293 4.47308 11.957 5.03333L13.0348 6.88245L0.667672 8.25383C-0.219578 8.34983 -0.220328 9.65033 0.667672 9.7467Z" fill="#A8DD15" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className='py-1.5 px-2.5 text-sm text-black700 font-medium border border-solid border-border-gray800 bg-white rounded-full w-fit flex items-center gap-2'>
                                        <CheckIcon />
                                        {partner.socialProof}
                                    </div>
                                    <div className='pt-5'>
                                        <Link href={`/${category?.slug}/${partner.slug}`}>
                                        <Button size="md" variant="primary" className="px-5 w-full justify-center gap-2.5 py-2 group">
                                           
                                                View Integration
                                                <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                        </Button>
                                            </Link>

                                    </div>
                                </motion.div>
                            )
                        })
                    }
                </motion.div>
            </div>
        </div>
    )
}
