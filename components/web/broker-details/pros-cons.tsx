import React from 'react'
import ArrowDanger from '~/components/common/icons/arrow-danger';
import ArrowIcon from '~/components/common/icons/arrow-icon';
const RoundIcon = '/assets/images/round.svg';

export default function ProsCons() {
    return (
        <div className='grid grid-cols-2 gap-4 pb-4'>
            <div className='p-4 rounded-xl border border-[#08a97526] bg-[#08a9750d]'>
                <div className='flex items-center gap-2 pb-3'>
                    <img src={RoundIcon} alt="RoundIcon" className='block' />
                    <span className='block text-base font-medium text-black'>
                        Pros:
                    </span>
                </div>
                <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                <div className='pt-4'>
                    {
                        [...Array(4)].map(() => {
                            return (
                                <div className='flex items-start gap-2 pb-2 last:pb-0'>
                                    <div className='flex-shrink-0 pt-[2px]'>
                                        <ArrowIcon />
                                    </div>
                                    <span className='text-base text-black100 font-medium leading-snug'>
                                        MT4/MT5/cTrader/TradingView platform choice
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='p-4 rounded-xl border border-[#eb626226] bg-[#eb62620d]'>
                <div className='flex items-center gap-2 pb-3'>
                    <img src={RoundIcon} alt="RoundIcon" className='block' />
                    <span className='block text-base font-medium text-black'>
                        Cons:
                    </span>
                </div>
                <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                <div className='pt-4'>
                    {
                        [...Array(4)].map(() => {
                            return (
                                <div className='flex items-start gap-2 pb-2 last:pb-0'>
                                    <div className='flex-shrink-0 pt-[2px]'>
                                        <ArrowDanger />
                                    </div>
                                    <span className='text-base text-black100 font-medium leading-snug'>
                                        Demo account limited to 60 days only
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>

    )
}
