"use client"
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import { Button } from '~/components/common/button';
import { Favicon } from '~/components/web/ui/favicon';
const SolIcon = '/assets/images/sol.svg';
const CrmIcon = '/assets/images/crm.svg';
const PageImage = '/assets/images/page-img.png';
const SecureIcon = '/assets/images/sequre.svg';
const LmaxIcon = '/assets/images/LMAX-icon.svg';
const LineIcon = '/assets/images/line1.svg';
const Line2Icon = '/assets/images/line2.svg';
const PlatformImage = '/assets/images/platform.png';

export interface Partner {
    id: string | number;
    order?: number;
    name: string;
    title?: string;
    subtitle?: string | null;
    description?: string;
    logo?: string;
    logoUrl?: string;
    slug: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    label?: string | null;
    description?: string | null;
}

interface CategoriesCardProps {
    AlgoCategory?: Category | null;
    bridgeCategory?: Category | null;
    liquidityCategory?: Category | null;
    PSPCategory?: Category | null;
    trustedCategory?: Category | null;
    crmCategory?: Category | null;
    educationCategory?: Category | null;
    tradingCategory?: Category | null;
    AlgoPartners: Partner[];
    bridgePartners: Partner[];
    liquidityPartners: Partner[];
    PSPPartners: Partner[];
    trustedPlatforms: Partner[];
    crmPartners: Partner[];
    educationPartners: Partner[];
    tradingPartners: Partner[];
    allBrokers: Partner[];
}

export default function CategoriesCard({
    AlgoCategory,
    bridgeCategory,
    liquidityCategory,
    PSPCategory,
    trustedCategory,
    crmCategory,
    educationCategory,
    tradingCategory,
    AlgoPartners,
    bridgePartners,
    liquidityPartners,
    PSPPartners,
    trustedPlatforms,
    crmPartners,
    educationPartners,
    tradingPartners,
    allBrokers
}: CategoriesCardProps) {
    return (
        <>
            <section className='pb-100 max-mobile:pb-16'>
                <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                    <div className='grid grid-cols-2 max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-6'>
                        <div className='bg-white rounded-2xl items-center border border-solid border-border-light500 py-10 px-10 max-tab:py-8 max-tab:px-6 max-mobile:py-6 max-mobile:px-5 grid grid-cols-[1fr_333px] max-tab:grid-cols-1 gap-8'>
                            <div>
                                <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl'>
                                    {AlgoCategory?.label || AlgoCategory?.name || 'Algorithmic Trading and Bot Providers'}
                                </h2>
                                <p className='text-base text-black700 mb-5 font-medium max-mobile:text-sm'>
                                    {AlgoCategory?.description || 'A curated collection of the best retail Traders and Technically Skilled Traders'}
                                </p>
                               <Link href={`/categories/${AlgoCategory?.slug || 'algo-trading'}`}>
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                    
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                </Button>
                                    </Link>

                            </div>
                            <div className='flex justify-center'>
                                <div className='max-w-[270px] w-full relative flex items-center justify-center h-[270px] max-mobile:h-[220px] max-mobile:max-w-[220px]'>
                                    <svg width="100%" height="100%" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                                        <motion.circle
                                            cx="135"
                                            cy="135"
                                            r="134"
                                            stroke="#CFCFCF"
                                            stroke-dasharray="6 6"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                            style={{ transformOrigin: "center" }}
                                        />
                                        <motion.circle
                                            cx="135"
                                            cy="135"
                                            r="102"
                                            stroke="#CFCFCF"
                                            stroke-opacity="0.3"
                                            stroke-dasharray="6 6"
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                            style={{ transformOrigin: "center" }}
                                        />
                                        <motion.circle
                                            cx="135"
                                            cy="135"
                                            r="70"
                                            stroke="#CFCFCF"
                                            stroke-opacity="0.2"
                                            stroke-dasharray="6 6"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            style={{ transformOrigin: "center" }}
                                        />
                                    </svg>

                                    <div className='w-16 h-16 bg-white border border-solid border-border-lightgreen rounded-full absolute flex items-center justify-center z-10 shadow-[0_0_20px_rgba(168,221,21,0.15)] overflow-hidden'>
                                        <Favicon src={AlgoPartners[0]?.logoUrl || AlgoPartners[0]?.logo} className='w-10 h-10 object-contain' />
                                    </div>
                                    <motion.div
                                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-solid border-border-lightgreen rounded-full flex items-center justify-center shadow-md z-20"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Favicon src={AlgoPartners[1]?.logoUrl || AlgoPartners[1]?.logo} className='w-10 h-10 object-contain' />

                                        </div>
                                    </motion.div>


                                    <motion.div
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white border border-solid border-border-lightgreen rounded-full flex items-center justify-center shadow-md z-20"
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Favicon src={AlgoPartners[2]?.logoUrl || AlgoPartners[2]?.logo} className='w-10 h-10 object-contain' />

                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-solid border-border-lightgreen rounded-full flex items-center justify-center shadow-md z-20"
                                        animate={{ x: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Favicon src={AlgoPartners[3]?.logoUrl || AlgoPartners[3]?.logo} className='w-10 h-10 object-contain' />

                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-solid border-border-lightgreen rounded-full flex items-center justify-center shadow-md z-20"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Favicon src={AlgoPartners[4]?.logoUrl || AlgoPartners[4]?.logo} className='w-10 h-10 object-contain' />

                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl items-center border border-solid border-border-light500 p-[30px] max-mobile:p-6 pb-5 flex flex-col'>
                            <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl w-full'>
                                {bridgeCategory?.label || bridgeCategory?.name || 'Bridge and Plug in Partners Tools'}
                            </h2>
                            <p className='text-base text-black700 mb-5 font-medium  max-mobile:text-sm w-full'>
                                {bridgeCategory?.description || 'A curated collection of bridge and plug-in partners to connect systems, automate workflows, and enhance functionality.'}
                            </p>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-3 w-full mb-6'>
                                {
                                    bridgePartners.map((partner) => {
                                        return (
                                            <div key={partner.id} className='rounded-tr-[8px] rounded-bl-[8px] flex items-center gap-2 border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-2.5 overflow-hidden'>
                                                <Favicon src={partner.logoUrl || partner.logo} className='block min-w-[24px] w-6 h-6 object-contain' />
                                                <span className='block text-base max-mobile:text-sm font-medium text-black truncate'>
                                                    {partner.name}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='mt-auto flex items-center justify-center pt-4'>
                                    <Link href={`/categories/${bridgeCategory?.slug || 'bridge-and-plug-in-partners'}`}>
                               
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                </Button>
                                    </Link>

                            </div>
                        </div>
                        {/* <div className='bg-white relative rounded-2xl border border-solid border-border-light500 p-[30px] max-mobile:p-6 pb-5 flex flex-col'>
                            <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl'>
                                {crmCategory?.label || crmCategory?.name || 'CRM and Back Office Software Tools'}
                            </h2>
                            <p className='text-base text-black700 mb-5 font-medium max-w-[351px] max-mobile:text-sm'>
                                {crmCategory?.description || 'A curated collection of the best broker Operators and Fintech Teams'}
                            </p>
                            <div className='flex justify-center mb-10'>
                                <img src={CrmIcon} alt="CrmIcon" className='block w-full max-w-[280px] h-auto' />
                            </div>
                            <div className='mt-auto flex items-center justify-center laptop:absolute laptop:bottom-8 laptop:left-1/2 laptop:-translate-x-1/2 w-full'>
                                    <Link href={`/categories/${crmCategory?.slug || 'forex-crm-providers'}`}>
                               
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                </Button>
                                    </Link>

                            </div>
                        </div> */}
                    </div>
                    <div className='pt-[30px] grid grid-cols-[390px_1fr_390px] max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-6'>
                        <div className='bg-white overflow-hidden rounded-2xl border border-solid border-border-light500 flex flex-col'>
                            <div className='p-[30px] max-mobile:p-6'>
                                <div className='flex items-center justify-between gap-2 mb-2'>
                                    <h2 className='text-2xl font-bold text-black100 max-mobile:text-xl'>
                                        {educationCategory?.label || educationCategory?.name || 'Forex Education and Training Tools'}
                                    </h2>
                                    <div className='w-9 min-w-9 min-h-9 h-9 cursor-pointer bg-black flex items-center justify-center rounded-full'>
                                        <Link href={`/categories/${educationCategory?.slug || 'forex-trading-courses'}`}>
                                            <MoveRight className='w-4 h-4 text-white' />
                                        </Link>
                                    </div>
                                </div>
                                <p className='text-base text-black700 mb-5 font-medium max-mobile:text-sm'>
                                    {educationCategory?.description?.slice(0, 150)}  ...
                                </p>
                            </div>
                            <div className='mt-auto border-t border-[rgba(26,26,26,0.05)] bg-[#FAFAFA] flex items-center justify-center p-6'>
                                <img src={PageImage} alt="PageImage" className='block h-[210px] max-mobile:h-40 w-auto object-contain' />
                            </div>
                        </div>
                        <div className='bg-white flex flex-col justify-between py-[30px] max-mobile:py-8 rounded-2xl border border-solid border-border-light500 min-w-0 overflow-hidden max-tab:col-span-2 max-mobile:col-span-1'>
                            <div>
                                <div className='flex items-center gap-5 overflow-hidden w-full'>
                                    <motion.div
                                        className='flex items-center gap-5'
                                        animate={{ x: [0, "-50%"] }}
                                        transition={{
                                            duration: 50,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        {
                                            allBrokers.map((partner) => {
                                                return (
                                                    <div key={partner.id} className="w-[70px] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border border-solid border-border-lightgreen200 bg-white">
                                                        <img src={partner.logoUrl || partner.logo} alt={partner.name} className='block max-w-[35px] object-contain' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </motion.div>
                                </div>
                                <div className='flex pt-5 items-center gap-5 overflow-hidden w-full'>
                                    <motion.div
                                        className='flex items-center gap-5'
                                        animate={{ x: ["-50%", 0] }}
                                        transition={{
                                            duration: 70,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        {
                                            [...allBrokers].reverse().map((partner) => {
                                                return (
                                                    <div key={partner.id} className="w-[70px] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border border-solid border-border-lightgreen200 bg-white">
                                                        <img src={partner.logoUrl || partner.logo} alt={partner.name} className='block max-w-[35px] object-contain' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </motion.div>
                                </div>
                            </div>
                            <div className='px-[30px] max-mobile:px-6 flex items-center justify-between gap-4 max-mobile:grid max-mobile:grid-cols-1'>
                                <div className=''>
                                    <h2 className='text-2xl font-bold text-black100 mb-1 max-mobile:text-xl'>
                                        Forex Brokers
                                    </h2>
                                    <p className='text-base text-black700 font-medium max-mobile:text-sm'>
                                        A curated collection of the best retail Traders and Investors
                                    </p>
                                </div>
                                <div className='shrink-0'>
                                        <Link href="/brokers">
                                   
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                            View Item
                                            <div>
                                                <MoveRight className='w-4 h-4' />
                                            </div>
                                    </Button>
                                        </Link>

                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl border border-solid border-border-light500 flex flex-col'>
                            <div className='p-[30px] max-mobile:p-6 pb-0 flex-1'>
                                <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl'>
                                    {liquidityCategory?.name || 'Liquidity Partners Tools'}
                                </h2>
                                <p className='text-base text-black700 mb-5 font-medium max-mobile:text-sm'>
                                    {liquidityCategory?.description || 'A curated collection of the best connect with reliable liquidity partners to ensure seamless trade execution.'}
                                </p>
                                <div className='relative pt-3 min-h-[180px]'>
                                    <div className='absolute top-0 left-0 w-full h-full opacity-30'>
                                        <img src={LineIcon} alt="LineIcon" className='block w-full h-full object-cover' />
                                    </div>
                                    <div className='absolute bottom-0 right-0 w-full h-full opacity-30'>
                                        <img src={Line2Icon} alt="Line2Icon" className='block w-full h-full object-cover' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 relative max-w-[260px] w-full mx-auto'>
                                        {
                                            liquidityPartners.slice(0, 4).map((partner) => {
                                                return (
                                                    <div key={partner.id} className='rounded-lg p-3 border border-[rgba(26,26,26,0.10)] bg-white shadow-sm flex flex-col items-center gap-2'>
                                                        <span className='text-xs font-semibold text-center text-grey-600 truncate w-full'>
                                                            {partner.name}
                                                        </span>
                                                        <Favicon src={partner.logoUrl || partner.logo} className='block w-8 h-8 object-contain' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='p-[30px] max-mobile:p-6 pt-4 flex justify-center'>
                                    <Link href={`/categories/${liquidityCategory?.slug || 'liquidity-providers'}`}>
                                
                                <Button variant='primary' size='md' className='flex items-center gap-2 z-20'>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                </Button>
                                    </Link>

                            </div>
                        </div>
                    </div>
                    <div className='pt-[30px] grid grid-cols-[390px_390px_1fr] max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-6'>
                        <div className='bg-white overflow-hidden rounded-2xl border border-solid border-border-light500 flex flex-col'>
                            <div className='p-[30px] max-mobile:p-6 flex-1'>
                                <div className='flex items-center justify-between gap-2 mb-2'>
                                    <h2 className='text-2xl font-bold text-black100 max-mobile:text-xl'>
                                        {PSPCategory?.name || 'PSP Partners'}
                                    </h2>
                                    <div className='w-9 min-w-9 min-h-9 h-9 cursor-pointer bg-black flex items-center justify-center rounded-full'>
                                        <Link href={`/categories/${PSPCategory?.slug || 'forex-psp-partners'}`}>
                                            <MoveRight className='w-4 h-4 text-white' />
                                        </Link>
                                    </div>
                                </div>
                                <p className='text-base text-black700 mb-8 font-medium max-mobile:text-sm'>
                                    {PSPCategory?.description || 'A curated collection of the best integrate with trusted PSP partners.'}
                                </p>
                                <div className='flex justify-center items-center gap-6 py-4'>
                                    {PSPPartners.slice(0, 3).map((p, i) => (
                                        <div key={p.id} className={`w-16 h-16 max-mobile:w-14 max-mobile:h-14 rounded-lg flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-sm ${i === 1 ? 'scale-110 rotate-12 z-10' : 'rotate-[-6deg]'}`}>
                                            <Favicon src={p.logoUrl || p.logo} className='block w-10 h-10 object-contain' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='bg-white overflow-hidden rounded-2xl border border-solid border-border-light500 p-[30px] max-mobile:p-6 flex flex-col'>
                            <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl'>
                                {trustedCategory?.name || 'Top-Rated Forex Brokers'}
                            </h2>
                            <p className='text-base text-black700 mb-5 font-medium max-mobile:text-sm'>
                                {trustedCategory?.description || 'A curated collection of the best browse verified forex brokers.'}
                            </p>
                            <div className='grid grid-cols-4 gap-4 mb-8'>
                                {
                                    trustedPlatforms.slice(0, 8).map((partner) => {
                                        return (
                                            <div key={partner.id} className='border rounded-lg flex items-center justify-center w-full h-14 max-mobile:h-12 border-[rgba(26,26,26,0.10)] bg-white shadow-sm'>
                                                <Favicon src={partner.logoUrl || partner.logo} className='block w-8 h-8 object-contain' />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='mt-auto flex items-center justify-center'>
                                    <Link href={`/categories/${trustedCategory?.slug || 'trusted-trading-platforms'}`}>

                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                </Button>
                                    </Link>

                            </div>
                        </div>
                        <div className='bg-white overflow-hidden flex rounded-2xl border border-solid border-border-light500 p-[30px] max-mobile:p-6 max-tab:col-span-2 max-mobile:col-span-1'>
                            <div className="grid h-full grid-cols-[1fr_339px] max-tab:grid-cols-1 gap-10 items-center">
                                <div className='max-tab:order-2'>
                                    <h2 className='text-2xl font-bold text-black100 mb-1.5 max-mobile:text-xl'>
                                        {tradingCategory?.name || 'Trading Platform Partners Tools'}
                                    </h2>
                                    <p className='text-base text-black700 mb-5 font-medium max-mobile:text-sm'>
                                        {tradingCategory?.description || 'A curated collection of the best connect with trusted trading platform partners.'}
                                    </p>
                                        <Link href={`/categories/${tradingCategory?.slug || 'forex-trading-platform'}`}>

                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                            View Item
                                            <div>
                                                <MoveRight className='w-4 h-4' />
                                            </div>
                                    </Button>
                                        </Link>

                                </div>
                                <div className='max-tab:order-1 flex justify-center'>
                                    <img src={PlatformImage} alt="PlatformImage" className='block w-full max-w-[280px] h-auto object-contain' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
            </div>
        </>
    )
}
