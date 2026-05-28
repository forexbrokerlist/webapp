import React from 'react'
import CommonBanner from '~/components/web/common-banner';
const TradeImage = '/assets/images/contact-us.svg';

export default function page() {
    return (
        <div>
            <CommonBanner
                image={TradeImage}
                highlightedText="Real-time crypto & finance news" title="Wwith AI-powered market impact analysis." />



            <section className='pb-100'>
                <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 '>
                    <h2 className='text-[42px] mb-10 max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-semibold'>
                        Exhibition News
                    </h2>
                    <div className='grid grid-cols-2 gap-4'>
                        {
                            [...Array(6)].map(() => {
                                return (
                                    <div className='grid grid-cols-[1fr_343px] gap-4'>
                                        <div className='bg-white p-4 rounded-xl'>
                                            <div className='flex items-center gap-1 pb-3'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M16.498 9C16.498 13.14 13.138 16.5 8.99805 16.5C4.85805 16.5 1.49805 13.14 1.49805 9C1.49805 4.86 4.85805 1.5 8.99805 1.5C13.138 1.5 16.498 4.86 16.498 9Z" stroke="#1A1A1A" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M11.7866 11.3848L9.46156 9.99732C9.05656 9.75732 8.72656 9.17982 8.72656 8.70732V5.63232" stroke="#1A1A1A" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <span className='block text-base font-medium text-black700'>
                                                    2025-11-11
                                                </span>
                                            </div>
                                            <h3 className='text-xl font-semibold text-black100 line-clamp-3 mb-3'>
                                                ForexEXPO Dubai 2025 Concludes Successfully — Shaping a Transparent, Innovative Future
                                            </h3>
                                            <p className='text-base text-black700 line-clamp-4 font-normal'>
                                                On November 11, WikiEXPO Dubai 2025, hosted by WikiGlobal and co-organized by WikiFX, successfully concluded. As one of the world’s most influential Fintech expos,
                                                this event
                                            </p>
                                        </div>
                                        <div className='h-full'>
                                            <img className='block w-full h-full object-cover rounded-xl' src='https://www.shutterstock.com/image-vector/breaking-news-live-announcement-banner-600nw-2643360791.jpg' />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}
