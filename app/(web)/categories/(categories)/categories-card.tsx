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
            <section className='py-100'>
                <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                    <div className='grid grid-cols-[1fr_390px_390px] gap-6'>
                        <div className='bg-white rounded-2xl items-center border border-solid border-border-light500 py-[40px] px-10 grid grid-cols-[1fr_333px]'>
                            <div>
                                <h2 className='text-2xl font-bold text-black100 mb-1.5 max-w-[351px]'>
                                    {AlgoCategory?.label || AlgoCategory?.name || 'Algorithmic Trading and Bot Providers'}
                                </h2>
                                <p className='text-base text-black700 mb-5 font-medium max-w-[351px]'>
                                    {AlgoCategory?.description || 'A curated collection of the best retail Traders and Technically Skilled Traders'}
                                </p>
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                    <Link href="/categories/algorithmic-trading-and-bot-providers">
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                            <div>
                                <div className='max-w-[270px] w-full mx-auto relative flex items-center justify-center h-[270px]'>
                                    <svg width="270" height="270" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
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
                        <div className='bg-white rounded-2xl items-center border border-solid border-border-light500 p-[30px] pb-5'>
                            <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                {bridgeCategory?.label || bridgeCategory?.name || 'Bridge and Plug in Partners Tools'}
                            </h2>
                            <p className='text-base text-black700 mb-5 font-medium max-w-[351px]'>
                                {bridgeCategory?.description || 'A curated collection of bridge and plug-in partners to connect systems, automate workflows, and enhance functionality.'}
                            </p>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                                {
                                    bridgePartners.map((partner) => {
                                        return (
                                            <div key={partner.id} className='rounded-tr-[8px] rounded-bl-[8px] flex items-center gap-2 border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-2.5'>
                                                <Favicon src={partner.logoUrl || partner.logo} className='block max-w-[28px] w-[28px] object-contain' />
                                                <span className='block text-base font-medium text-black truncate'>
                                                    {partner.name}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='flex items-center justify-center pt-4'>
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                    <Link href={`/categories/${bridgeCategory?.slug || 'bridge-and-plug-in-partners'}`}>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className='bg-white relative rounded-2xl items-center border border-solid border-border-light500 p-[30px] pb-5'>
                            <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                {crmCategory?.label || crmCategory?.name || 'CRM and Back Office Software Tools'}
                            </h2>
                            <p className='text-base text-black700 mb-5 font-medium max-w-[351px]'>
                                {crmCategory?.description || 'A curated collection of the best broker Operators and Fintech Teams'}
                            </p>
                            <div>
                                <img src={CrmIcon} alt="CrmIcon" className='block w-full h-full' />
                            </div>
                            <div className='flex items-center justify-center absolute bottom-5 left-1/2 -translate-x-1/2'>
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                    <Link href="/categories/crm-and-back-office-software">

                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='pt-[30px] grid grid-cols-[390px_1fr_390px] gap-6'>
                        <div className='bg-white overflow-hidden rounded-2xl items-center border border-solid border-border-light500'>
                            <div className='p-[30px] pb-2'>
                                <div className='flex items-center gap-2'>
                                    <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                        {educationCategory?.label || educationCategory?.name || 'Forex Education and Training Tools'}
                                    </h2>
                                    <Link 
                                        href="/categories/forex-education-and-training"
                                        className='w-9 min-w-9 min-h-9 h-9 cursor-pointer bg-black100 hover:bg-primary border border-solid border-black100 hover:border-primary flex items-center justify-center rounded-full transition-all duration-300 group'
                                    >
                                        <MoveRight className='w-4 h-4 text-white group-hover:text-black100 transition-colors duration-300' />
                                    </Link>
                                </div>
                                <p className='text-base pt-1.5 text-black700 mb-5 font-medium max-w-[351px] whitespace-pre-line'>
                                  {educationCategory?.description?.slice(0, 150)}
                                  {(educationCategory?.description?.length ?? 0) > 150 && "..."}
                                </p>
                            </div>
                            <div className='rounded-2xl h-[210px] border-[1.2px] border-[rgba(26,26,26,0.05)] bg-white backdrop-blur-[5px]'>
                                <img src={PageImage} alt="PageImage" className='block h-[210px] max-w-[300px] mx-auto object-contain' />
                            </div>
                        </div>
                        <div className='bg-white flex flex-col justify-between py-[30px] rounded-2xl border border-solid border-border-light500 min-w-0 overflow-hidden'>
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
                            <div className='px-[30px] flex items-center justify-between'>
                                <div className=''>
                                    <h2 className='text-2xl text-black100 font-bold mb-1'>
                                        Forex Brokers
                                    </h2>

                                    <p className='text-base pt-1.5 text-black700  font-medium '>
                                        A curated collection of the best retail Traders and Investors
                                    </p>

                                </div>
                                <div >
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        <Link href="/brokers">

                                            View Item
                                            <div>
                                                <MoveRight className='w-4 h-4' />
                                            </div>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-2xl items-center border border-solid border-border-light500'>
                            <div className='py-[30px] px-0'>
                                <div className='px-[30px]'>
                                    <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                        {liquidityCategory?.name || 'Liquidity Partners Tools'}
                                    </h2>
                                    <p className='text-base pt-1.5 text-black700 mb-5 font-medium max-w-[351px]'>
                                        {liquidityCategory?.description || 'A curated collection of the best connect with reliable liquidity partners to ensure seamless trade execution and optimal market depth.'}
                                    </p>
                                </div>
                                <div className='relative pt-3'>
                                    <div className='absolute top-0 left-0 w-full h-full'>
                                        <img src={LineIcon} alt="LineIcon" className='block w-full' />
                                    </div>
                                    <div className='absolute bottom-[-100px] right-0 w-full h-full'>
                                        <img src={Line2Icon} alt="Line2Icon" className='block w-full' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-5 relative max-w-[282px] w-full mx-auto'>
                                        {
                                            liquidityPartners.map((partner) => {
                                                return (
                                                    <div key={partner.id} className='rounded-lg p-3 border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.10)]'>
                                                        <p className='text-base mb-3 font-semibold text-center text-grey-600'>
                                                            {partner.name}
                                                        </p>
                                                        <div className='flex justify-center'>
                                                            <img src={partner.logoUrl || partner.logo} alt={partner.name} className='block max-w-[40px]' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className='px-[30px] flex justify-center pt-4 relative z-20'>
                                <Link href={`/categories/${liquidityCategory?.slug || 'liquidity-partners'}`} passHref legacyBehavior>
                                    <Button variant='primary' size='md' className='flex items-center gap-2 relative z-20'>
                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='pt-[30px] grid grid-cols-[390px_390px_1fr] gap-6'>
                        <div className='bg-white overflow-hidden rounded-2xl items-center border border-solid border-border-light500'>
                            <div className='p-[30px] pb-2'>
                                <div className='flex items-center justify-between gap-2'>
                                    <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                        {PSPCategory?.name || 'PSP Partners'}
                                    </h2>
                                    <Link 
                                        href="/categories/psp-partners"
                                        className='w-9 min-w-9 min-h-9 h-9 cursor-pointer bg-black100 hover:bg-primary border border-solid border-black100 hover:border-primary flex items-center justify-center rounded-full transition-all duration-300 group'
                                    >
                                        <MoveRight className='w-4 h-4 text-white group-hover:text-black100 transition-colors duration-300' />
                                    </Link>
                                </div>
                                <p className='text-base pt-1.5 text-black700 mb-5 font-medium max-w-[351px]'>
                                    {PSPCategory?.description || 'A curated collection of the best integrate with trusted PSP partners to enable secure, fast, and seamless payment processing for your platform.'}
                                </p>
                                <div className='flex justify-center gap-4 pt-6'>
                                    <div className="w-[70px] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rounded-lg overflow-hidden flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                                        <img src={PSPPartners[0]?.logoUrl || PSPPartners[0]?.logo} alt="SecureIcon" className='block max-w-[35px] object-contain' />
                                    </div>
                                    <div className="w-[70px] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rotate-45 rounded-lg overflow-hidden flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                                        <img src={PSPPartners[1]?.logoUrl || PSPPartners[1]?.logo} alt="SecureIcon" className='block max-w-[35px] object-contain' />
                                    </div>
                                </div>
                                <div className='flex justify-center gap-4 pt-3 pb-3'>
                                    <div className="w-[70px] rotate-[7deg] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rounded-lg overflow-hidden flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                                        <img src={PSPPartners[2]?.logoUrl || PSPPartners[2]?.logo} alt="SecureIcon" className='block max-w-[35px] object-contain' />
                                    </div>
                                    <div className="w-[70px] rotate-[-13deg] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rotate-45 rounded-lg overflow-hidden flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                                        <img src={PSPPartners[3]?.logoUrl || PSPPartners[3]?.logo} alt="SecureIcon" className='block max-w-[35px] object-contain' />
                                    </div>
                                    <div className="w-[70px] rotate-[8deg] min-w-[70px] max-w-[70px] min-h-[70px] h-[70px] rotate-45 rounded-lg overflow-hidden flex items-center justify-center border border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                                        <img src={PSPPartners[4]?.logoUrl || PSPPartners[4]?.logo} alt="SecureIcon" className='block max-w-[35px] object-contain' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white overflow-hidden rounded-2xl items-center border border-solid border-border-light500 p-[30px]'>
                            <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                {trustedCategory?.name || 'Top-Rated Forex Brokers & Trading Platforms Tools'}
                            </h2>
                            <p className='text-base pt-1.5 text-black700 mb-5 font-medium max-w-[351px]'>
                                {trustedCategory?.description || 'A curated collection of the best browse verified forex brokers and trading platforms, compare spreads, regulation, and features to find the right fit for your trading goals.'}
                            </p>
                            <div className='grid grid-cols-4 gap-4'>
                                {
                                    trustedPlatforms.map((partner) => {
                                        return (
                                            <div key={partner.id} className='border  rounded-lg flex items-center justify-center w-full h-[64px] border-[rgba(26,26,26,0.10)] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)]'>
                                                <img src={partner.logoUrl || partner.logo} alt={partner.name} className='block max-w-[35px] object-contain' />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='flex items-center justify-center pt-4'>
                                <Button variant='primary' size='md' className='flex items-center gap-2'>
                                    <Link href="/categories/trusted-trading-platforms">

                                        View Item
                                        <div>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className='bg-white overflow-hidden flex rounded-2xl items-center border border-solid border-border-light500 p-[30px]'>
                            <div className="grid h-full grid-cols-[1fr_339px] gap-5 items-center">
                                <div>
                                    <h2 className='text-2xl text-black100 font-bold mb-1.5'>
                                        {tradingCategory?.name || 'Trading Platform Partners Tools'}
                                    </h2>
                                    <p className='text-base pt-1.5 text-black700 mb-5 font-medium max-w-[351px]'>
                                        {tradingCategory?.description || 'A curated collection of the best connect with trusted trading platform partners to access advanced tools and seamless trading experiences.'}
                                    </p>
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        <Link href="/categories/trading-platform-partners">
                                            View Item
                                            <div>
                                                <MoveRight className='w-4 h-4' />
                                            </div>
                                        </Link>
                                    </Button>
                                </div>
                                <div>
                                    <img src={PlatformImage} alt="PlatformImage" className='block w-full h-full object-contain' />
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
