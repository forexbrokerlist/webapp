"use client"
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button'
import { MoveRight } from 'lucide-react'
import { Link } from '~/components/common/link'
import { Favicon } from '~/components/web/ui/favicon';

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
    slug: string
}

const GreenArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0.667672 9.74621L13.037 11.1195L11.957 12.9663C11.6293 13.5288 12.3369 14.1176 12.8304 13.695L17.7965 9.43871C17.8596 9.3845 17.9103 9.31729 17.945 9.2417C17.9797 9.1661 17.9977 9.0839 17.9977 9.00071C17.9977 8.91753 17.9797 8.83532 17.945 8.75973C17.9103 8.68413 17.8596 8.61693 17.7965 8.56271L12.8304 4.30646C12.3365 3.88159 11.6293 4.47259 11.957 5.03284L13.0348 6.88196L0.667672 8.25334C-0.219578 8.34934 -0.220328 9.64984 0.667672 9.74621Z" fill="#A8DD15" />
    </svg>
)

export default function AlgoTrading({ partners = [], title, description, category }: { partners?: Partner[], title: string, description: string, category?: any }) {
    // Show up to 3 partners, fallback to empty array if none
    const displayPartners = partners.length > 0 ? partners.slice(0, 3) : [];

    return (
        <section className='pt-100 max-mobile:pt-16'>
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
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[950px] whitespace-pre-line'
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
                            <Link href={`/categories/${category?.slug || 'algo-trading'}`}>

                        <Button variant='primary' size='md' className='flex items-center gap-2'>
                                Explore All
                                <div>
                                    <MoveRight />
                                </div>
                        </Button>
                            </Link>

                    </motion.div>
                </div>

                <div className='grid grid-cols-3 gap-10 max-mobile:gap-5 max-tab:grid-cols-1'>
                    {displayPartners.map((partner, index) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className='bg-white rounded-2xl p-4 max-mobile:p-2'
                        >
                            <div className=' h-[290px] max-mobile:h-auto bg-[#F0F1EC] p-2 max-mobile:p-1 rounded-xl'>
                                <img
                                    src={partner.bannerUrl || partner.logoUrl || FallbackBanner}
                                    alt={partner.name}
                                    className='w-full rounded-xl h-full object-cover'
                                />
                            </div>

                            <div className='grid grid-cols-[87px_1fr] gap-5 pt-5 pb-4 border-b border-solid border-border-light800'>
                                <div className='w-full h-[64px] rounded-lg bg-[#F2F4F7] flex items-center justify-center'>
                                    <div className='h-[40px] flex justify-center'>
                                        <Favicon src={partner.logoUrl} title={partner.name} size={35} contained className="size-full object-contain" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-xl font-bold text-black100'>{partner.name}</h3>
                                    <p className='text-sm text-black700 font-medium line-clamp-2 '>
                                        {partner.title}
                                    </p>
                                </div>
                            </div>

                            <div className='pt-5'>
                                {(partner.features?.length > 0 ? partner.features : []).slice(0, 4).map((feature, i) => {
                                    const hasColon = feature.includes(':');
                                    const label = hasColon ? feature.split(':')[0] : 'Feature';
                                    const value = hasColon ? feature.split(':')[1] : feature;

                                    return (
                                        <div key={i} className='flex pb-2 last:pb-0 items-center gap-2'>
                                            <GreenArrow />
                                            <p className='text-base font-medium text-black700'>
                                                <span className='font-bold text-black100'>{label} :</span> {value}
                                            </p>
                                        </div>
                                    )
                                })}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className='pt-4'
                                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                                >
                                     <Link href={`${category.slug}/${partner.slug}`}>
                                    <Button variant='primary' size='md' className='flex items-center bg-[#F0F1EC] text-black100 font-medium w-full gap-2'>
                                      
                                            Run Bot
                                            <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-black100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M9.44727 3.88257L13.4217 7.85697L9.44727 11.8314" stroke="white" stroke-width="0.982143" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M2.29102 7.85718H13.3107" stroke="white" stroke-width="0.982143" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                    </Button>
                                        </Link>

                                </motion.div>
                            </div>


                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
