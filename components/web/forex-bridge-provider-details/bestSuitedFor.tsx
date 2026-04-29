import React from 'react'
const RoundIcon = '/assets/images/round.svg';


const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? "#FBA100" : "#E2E8F0"}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
    </svg>
);

export default function BestSuitedFor({ broker,bridgeTitle }: { broker: any, showStarRatings?: Boolean, showFeatures?: Boolean,bridgeTitle?:string  }) {

    const platforms = broker?.best_suited_for||[]
    return (
        <>
         
            {platforms&&    
                <div id='best-suited-for' className='rounded-xl bg-[#f0f1ec4d] border border-border-light300 border-solid  overflow-hidden'>
                    <div className='p-4' >
                        <div className='grid grid-cols-1 gap-5'>
                            <div className=''>
                                <div className='flex items-center gap-2 pb-3'>
                                    <img src={RoundIcon} alt="RoundIcon" className='block' />
                                    <span className='block text-base font-medium text-black'>
                                       {bridgeTitle}
                                    </span>
                                </div>
                                <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>

                                <div className='pt-4 pb-2'>
                                    <div className='flex flex-wrap gap-2'>
                                        {platforms.map((platform: string, idx: number) => (
                                            <span key={idx} className='text-[12px] font-semibold px-3 py-1 rounded-full bg-[#A8DD15] text-black leading-tight'>
                                                {platform}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                             
                                </div>
                            </div>
                        </div>
                    </div>
              
                                    }
          </>
                                    )
                                        
}
