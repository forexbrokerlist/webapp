"use client"
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button'
import { MoveRight } from 'lucide-react'
import { Link } from '~/components/common/link'

const FallbackBanner = '/assets/images/pipgrid.png';

interface Partner {
    id: string;
    name: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    logoUrl: string;
    bannerUrl: string | null;
    websiteUrl: string | null;
    features: string[];
}

const GreenArrow = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#A8DD15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default function AlgoTrading({ partners = [] }: { partners?: Partner[] }) {
    // Show up to 3 partners, fallback to empty array if none
    const displayPartners = partners.length > 0 ? partners.slice(0, 3) : [];

    return (
        <section className='bg-[#F8F9F5] py-24 max-mobile:py-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-end justify-between mb-12 max-mobile:flex-col max-mobile:items-start max-mobile:gap-6'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        <motion.h2
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                            className='text-[42px] max-mobile:text-3xl leading-tight text-black100 font-bold font-monda'
                        >
                            Algo Trading & Forex Bot Provider
                        </motion.h2>
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[750px] mt-4'
                        >
                            Discover automated forex trading bots and algorithmic strategy providers built for passive income, consistent execution, and hands-free trading.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button variant='primary' size='md' className='flex items-center gap-2 bg-black100 text-white rounded-full px-8 py-3' asChild>
                            <Link href="/algorithmic-trading-and-bot-providers">
                                View More
                                <MoveRight size={20} />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <div className='grid grid-cols-3 gap-8 max-tab:grid-cols-1'>
                    {displayPartners.map((partner, index) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className='bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col h-full'
                        >
                            <div className='overflow-hidden rounded-3xl mb-8 h-[220px]'>
                                <img
                                    src={partner.bannerUrl || partner.logoUrl || FallbackBanner}
                                    alt={partner.name}
                                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                                />
                            </div>

                            <div className='flex items-center gap-4 mb-4'>
                                <div className='w-16 h-16 rounded-2xl bg-[#F8F9FA] flex items-center justify-center p-3 shadow-sm border border-gray-50 flex-shrink-0'>
                                    <img src={partner.logoUrl} alt={partner.name} className='max-w-full max-h-full object-contain' onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=A8DD15&color=fff`;
                                    }} />
                                </div>
                                <div>
                                    <h3 className='text-2xl font-bold text-black100 font-monda'>{partner.name}</h3>
                                    <p className='text-sm text-black700 font-medium line-clamp-2 mt-1'>
                                        {partner.title}
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-4 my-8 flex-grow border-t border-gray-100 pt-8'>
                                {(partner.features?.length > 0 ? partner.features : []).slice(0, 4).map((feature, i) => {
                                    const hasColon = feature.includes(':');
                                    const label = hasColon ? feature.split(':')[0] : 'Feature';
                                    const value = hasColon ? feature.split(':')[1] : feature;

                                    return (
                                        <div key={i} className='flex items-center gap-3'>
                                            <GreenArrow />
                                            <p className='text-base font-medium text-black700'>
                                                <span className='font-bold text-black100'>{label} :</span> {value}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            <Button
                                variant='primary'
                                size='md'
                                className='w-full bg-[#F2F4F0] hover:bg-primary text-black100 border-none rounded-2xl py-4 flex items-center justify-center gap-3 group transition-all duration-300'
                                asChild
                            >
                                <Link href={partner.websiteUrl || `/algorithmic-trading-and-bot-providers/${partner.id}`}>
                                    <span className='font-bold text-lg'>Run Bot</span>
                                    <div className='w-8 h-8 rounded-full bg-black100 flex items-center justify-center group-hover:bg-white transition-colors duration-300'>
                                        <MoveRight size={18} className='text-white group-hover:text-black100 transition-colors duration-300' />
                                    </div>
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
