import React from 'react'
const SuggestedImage = '/assets/images/suggested.png';

export default function SuggestedBroker() {
    return (
        <div className='rounded-xl border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    Suggested Broker
                </h3>
            </div>
            <div className='px-4'>
                {
                    [...Array(2)].map(() => {
                        return (
                            <div className='border mb-4 p-3 rounded-xl border-border-light180 border-solid'>
                                <div className='pb-3'>
                                    <img src={SuggestedImage} alt="SuggestedImage" className='block w-full rounded-t-xl' />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center border border-solid border-primary'>
                                        <img src='https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.fxpro.com&size=128' className='max-w-4 bg-white block object-contain' />
                                    </div>
                                    <span className='block text-lg font-medium text-black'>
                                        XM Broker
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* Content area placeholder */}
        </div>
    )
}
