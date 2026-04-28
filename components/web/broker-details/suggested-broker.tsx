import React from 'react'
import Link from 'next/link';
import { getPresignedUrlFromFull } from '~/lib/media';

export default async function SuggestedBroker({ brokers, suggestionTitle = "Suggested Broker" }: { brokers?: any[], suggestionTitle?: string }) {
    console.log('SuggestedBroker component - brokers received:', brokers);
    console.log('SuggestedBroker component - brokers length:', brokers?.length);
    console.log('SuggestedBroker component - suggestionTitle:', suggestionTitle);

    if (!brokers || brokers.length === 0) return null;

    // Process broker URLs to get presigned URLs
    const processedBrokers = await Promise.all(
        brokers.map(async (broker) => ({
            ...broker,
            logoUrl: broker.logoUrl ? await getPresignedUrlFromFull(broker.logoUrl) : null,
            screenshotUrl: broker.screenshotUrl ? await getPresignedUrlFromFull(broker.screenshotUrl) : null,
        }))
    );

    return (
        <div className='rounded-xl border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    {suggestionTitle}
                </h3>
            </div>
            <div className='px-4'>
                {
                    processedBrokers.map((broker, index) => {
                        const rawCategorySlug = broker.categories?.[0]?.slug;
                        const categorySlug = rawCategorySlug === 'trusted-trading-platforms' || rawCategorySlug === 'forex-brokers' ? 'broker' : (rawCategorySlug || 'broker');
                        return (
                            <Link target='_blank' href={`/${categorySlug}/${broker.slug}`} key={index} className='block border mb-4 p-3 rounded-xl border-border-light180 border-solid hover:border-primary transition-colors'>
                                <div className='pb-3'>
                                    <img src={broker.screenshotUrl || '/assets/images/suggested.png'} alt={broker.broker_name} className='block w-full rounded-t-xl h-[120px] object-cover' />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center border border-solid border-primary bg-white overflow-hidden'>
                                        <img src={broker.logoUrl || '/assets/images/placeholder-logo.png'} className='max-w-[30px] max-h-[30px] block object-contain' alt={broker.broker_name} />
                                    </div>
                                    <span className='block text-lg font-medium text-black truncate'>
                                        {broker.broker_name}
                                    </span>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}
