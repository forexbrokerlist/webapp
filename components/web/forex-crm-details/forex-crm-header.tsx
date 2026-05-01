import { Bookmark } from 'lucide-react';
import React, { Suspense } from 'react'
import { getPresignedUrl, getPresignedUrlFromFull } from '~/lib/media';
import { brokerIdSchema } from '~/server/admin/brokers/router';
import Link from 'next/link';
import { BrokerBookmarkButton } from '../brokers/broker-bookmark-button';
import { BrokerClaimButton } from '../brokers/broker-claim-button';
import { ProductListSkeleton } from '../products/product-list';
import { PlanQuery } from '../plans/plan-query';
import { headers } from "next/headers"
import { Badge } from '~/components/common/badge';



const StarIcon = ({ fillPercentage }: { fillPercentage: number }) => (
    <div className="relative inline-block w-4 h-4 shrink-0">
        {/* Empty Star (Gray) */}
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#E2E8F0"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0"
        >
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
        </svg>
        {/* Filled Star (Yellow) clipped by width */}
        <div
            className="absolute top-0 left-0 overflow-hidden h-full"
            style={{ width: `${fillPercentage}%` }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#FBA100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
            </svg>
        </div>
    </div>
);





const FramImage = '/assets/images/laptop-fram.png';
const Profilegroup = '/assets/images/profilegroup.svg';


export default async function ForexCrmDetailsHero({ broker }: { broker: any }) {
    const heroFeatures = [
        { value: broker.deployment_type && broker.deployment_type.length > 0 && broker.deployment_type.join(",") || '-', label: 'Deployment' },
        { value: broker.starting_price || '-', label: 'Starting Price' },
        { value: broker.bestFor&& broker.bestFor.length>0 ? broker.bestFor?.join(', ') : '-', label: 'Best For' },
        { value: broker.demoAccount?'Yes':'No', label: 'Demo Account' },
    ];
    const headerList = await headers()

    const websiteUrl = broker.broker_website || broker.url || '';
    const absoluteUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

    return (
        <div className='pt-100'>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 py-8 mb-10'>

                {/* Main banner container */}
                <div className="relative w-full  isolate">

                    <div className="absolute inset-y-0 left-[2%] right-[2%] md:left-[1.5%] md:right-[1.5%] bg-white transform -skew-x-[7.5deg] border border-solid border-border-light500 rounded-[16px] z-[-1] overflow-hidden  pointer-events-none">

                    </div>

                    <div className='grid grid-cols-[1fr_40%] items-center gap-10 py-5 px-[90px]'>
                        <div>
                            <div className='grid grid-cols-[65px_1fr] gap-3 pb-6'>
                                <div className='w-[65px] h-[65px] rounded-full flex items-center justify-center border border-solid border-primary'>
                                    <img src={(await getPresignedUrlFromFull(broker.logoUrl)) ?? undefined} alt="logo" className='max-w-[45px] bg-white block object-contain' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-3'>
                                        <h2 className='text-4xl text-primary font-semibold'>
                                            {broker?.broker_name}
                                        </h2>
                                        {broker?.isSponsor && (
                                            <Badge variant="info" size="md" className="rounded-full px-3">Verified</Badge>
                                        )}
                                        {broker?.demoAccount && (
                                            <Badge variant="success" size="md" className="rounded-full px-3">Free Demo</Badge>
                                        )}
                                    </div>
                                    
                                    <p className='text-base font-medium text-black100 flex items-center'>
                                      by  {broker?.company_name || '-'} <span className='mx-2 opacity-50'>·</span> Founded {broker?.year_established ? Math.floor(broker.year_established) : '-'} <span className='mx-2 opacity-50'>·</span> {broker?.headquarters || '-'}
                                    </p>
                                </div>
                            </div>
                            <p className='text-base font-medium text-black700 mb-5'>
                                {broker.description || "FP Markets stands out as a solid, no-nonsense Forex and CFD broker that, over the years, has evolved into one of the more reliable names in the industry, with its raw spreads, lightning-fast execution, and a well-optimized MT4 experience."}
                            </p>
                            <div className='grid grid-cols-4 gap-0 pb-6'>
                                {heroFeatures.map((feature, index) => (
                                    <div key={index} className='px-6 py-1.5 first:pl-0 last:pr-0 last:border-none border-solid border-r border-border-light300'>
                                        <h3 className='text-[15px] text-black100 font-semibold leading-none mb-2.5'>{feature.value}</h3>
                                        <p className='text-[12px] text-black700 font-medium leading-none'>{feature.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex items-center gap-3 pb-6 border-b border-solid border-border-light300'>
                                {absoluteUrl && <Link href={absoluteUrl} target='_blank' >
                                    <button className='py-2.5 px-5 w-[200px] justify-center text-base font-medium text-black100 border-none bg-primary rounded-full cursor-pointer flex items-center gap-2'>

                                        Visit Website
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.0988 3C7.44979 3.00657 5.53898 3.09617 4.31783 4.31752C3 5.63556 3 7.75692 3 11.9996C3 16.2423 3 18.3637 4.31783 19.6817C5.63565 20.9998 7.75667 20.9998 11.9988 20.9998C16.2407 20.9998 18.3618 20.9998 19.6796 19.6817C20.9007 18.4604 20.9903 16.5492 20.9969 12.8997" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M20.5542 3.49502L11.0469 13.0575M20.5542 3.49502C20.0602 3.00041 16.7325 3.04651 16.029 3.05652M20.5542 3.49502C21.0482 3.98964 21.0021 7.32163 20.9921 8.02604" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </Link>}

                                {/* <button className='py-2.5 px-5 w-[200px] justify-center text-base font-medium text-black100 border-none bg-[#F0F1EC] rounded-full cursor-pointer flex items-center gap-2'>
                                    Claim Ownership
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.5 2V5M6.5 2V5M11 2V5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M19 12V10.5C19 7.20017 19 5.55025 17.9749 4.52512C16.9497 3.5 15.2998 3.5 12 3.5H10C6.70017 3.5 5.05025 3.5 4.02513 4.52513C3 5.55025 3 7.20017 3 10.5V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H11" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 15H11M7 11H15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15.7367 21.6527L14 22L14.3473 20.2633C14.4179 19.9106 14.5913 19.5866 14.8456 19.3323L18.9111 15.2668C19.2668 14.9111 19.8437 14.9111 20.1995 15.2668L20.7332 15.8005C21.0889 16.1563 21.0889 16.7332 20.7332 17.0889L16.6677 21.1544C16.4134 21.4087 16.0894 21.5821 15.7367 21.6527Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button> */}
                                <BrokerClaimButton broker={broker}>
                                    <Suspense fallback={<ProductListSkeleton />}>
                                        <PlanQuery
                                            checkoutData={{
                                                successUrl: `${headerList.get("origin")}/brokers/${broker.slug}?claimed=true`,
                                                cancelUrl: headerList.get("referer") || "",
                                                metadata: {
                                                    brokerId: String(broker.id),
                                                    type: "claim",
                                                },
                                            }}
                                        />
                                    </Suspense>
                                </BrokerClaimButton>
                                {/* <div className='bg-[#F0F1EC] w-[44px] h-[44px] flex items-center justify-center rounded-full cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" stroke="#121212" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 7H20" stroke="#121212" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div> */}
                                <BrokerBookmarkButton brokerId={broker.id} />
                            </div>
                            {broker.overall_rating && <div className='pt-6 flex items-center gap-2'>
                                {/* <img src={Profilegroup} alt='Profilegroup' className='block' />
                                <p className='text-base font-medium text-black700'>
                                    Trusted by <span className='text-primary'> 70K+ </span> investors & traders with a  <span className='text-primary'> 4.8 out of 5 </span> rating
                                </p> */}
                                <div className='flex items-center gap-1 border border-[#1212120D]/95 bg-[#F0F2EC66]  rounded-full  px-4 py-1'>
                                    {[...Array(5)].map((_, i) => {
                                        const rating = parseFloat(broker.overall_rating || '0');
                                        const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
                                        return (
                                            <StarIcon
                                                key={i}
                                                fillPercentage={fillPercentage}
                                            />
                                        );
                                    })}
                                    <p className='text-base font-medium text-black700'>
                                        Trusted with a  <span className='text-primary'> {broker.overall_rating}/5 </span> customer rating
                                    </p>
                                </div>
                            </div>}
                        </div>
                        <div className="relative z-10 w-full flex items-center justify-center">
                            {/* The transparent laptop frame image on top */}
                            <img src={FramImage} alt='Laptop Frame' className="relative z-20 w-full object-contain pointer-events-none" />

                            {/* The dynamic screenshot positioned underneath the screen area */}
                            {(broker.screenshotUrl || broker.bannerUrl) && (
                                <img
                                    src={(await getPresignedUrlFromFull(broker.screenshotUrl || broker.bannerUrl)) ?? ''}
                                    alt="Broker Screenshot"
                                    className="absolute z-[999] w-[75.5%] h-[76%] top-[5%] mt-[14px] left-[12.2%] object-top"
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
