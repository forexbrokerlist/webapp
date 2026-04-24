import { Bookmark } from 'lucide-react';
import React from 'react'
const FramImage = '/assets/images/laptop-fram.png';
const Profilegroup = '/assets/images/profilegroup.svg';

const heroFeatures = [
    { value: '$0', label: 'Min Deposit' },
    { value: '0.0 pips', label: 'Raw Spread' },
    { value: '1:400', label: 'Max Leverage' },
    { value: '1,200+', label: 'Instruments' },
];
export default function BrokerDetailsHero() {
    return (
        <div className='pt-100'>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 py-8 mb-10'>

                {/* Main banner container */}
                <div className="relative w-full  isolate">

                    <div className="absolute inset-y-0 left-[2%] right-[2%] md:left-[1.5%] md:right-[1.5%] bg-white transform -skew-x-[7.5deg] border border-solid border-border-light500 rounded-[16px] z-[-1] overflow-hidden  pointer-events-none">

                    </div>

                    <div className='grid grid-cols-2 items-center gap-10 py-5 px-[90px]'>
                        <div>
                            <div className='grid grid-cols-[65px_1fr] gap-3 pb-6'>
                                <div className='w-[65px] h-[65px] rounded-full flex items-center justify-center border border-solid border-primary'>
                                    <img src='https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.fxpro.com&size=128' className='max-w-7 bg-white block object-contain' />
                                </div>
                                <div>
                                    <h2 className='text-4xl text-primary font-semibold'>
                                        Pepperstone
                                    </h2>
                                    <p className='text-base font-medium text-black100'>
                                        750,000+ traders worldwide. 0.0 pip spreads, 99.5% fill rate
                                    </p>
                                </div>
                            </div>
                            <p className='text-base font-medium text-black700 mb-5'>
                                FP Markets stands out as a solid, no-nonsense Forex and CFD broker that, over the
                                years, has evolved into one of the more reliable names in the industry, with its raw
                                spreads, lightning-fast execution, and a well-optimized MT4 experience. While testing
                                the platform, I found FP Markets’ suite of tools.
                            </p>
                            <div className='flex pb-6'>
                                {heroFeatures.map((feature, index) => (
                                    <div key={index} className='px-6 py-1.5 first:pl-0 last:pr-0 last:border-none border-solid border-r border-border-light300'>
                                        <h3 className='text-[22px] text-black100 font-semibold leading-none mb-2'>{feature.value}</h3>
                                        <p className='text-[15px] text-black700 font-medium leading-none'>{feature.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex items-center gap-3 pb-6 border-b border-solid border-border-light300'>
                                <button className='py-2.5 px-5 w-[200px] justify-center text-base font-medium text-black100 border-none bg-primary rounded-full cursor-pointer flex items-center gap-2'>
                                    Visit Broker
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M11.0988 3C7.44979 3.00657 5.53898 3.09617 4.31783 4.31752C3 5.63556 3 7.75692 3 11.9996C3 16.2423 3 18.3637 4.31783 19.6817C5.63565 20.9998 7.75667 20.9998 11.9988 20.9998C16.2407 20.9998 18.3618 20.9998 19.6796 19.6817C20.9007 18.4604 20.9903 16.5492 20.9969 12.8997" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M20.5542 3.49502L11.0469 13.0575M20.5542 3.49502C20.0602 3.00041 16.7325 3.04651 16.029 3.05652M20.5542 3.49502C21.0482 3.98964 21.0021 7.32163 20.9921 8.02604" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <button className='py-2.5 px-5 w-[200px] justify-center text-base font-medium text-black100 border-none bg-[#F0F1EC] rounded-full cursor-pointer flex items-center gap-2'>
                                    Claim Ownership
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.5 2V5M6.5 2V5M11 2V5" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M19 12V10.5C19 7.20017 19 5.55025 17.9749 4.52512C16.9497 3.5 15.2998 3.5 12 3.5H10C6.70017 3.5 5.05025 3.5 4.02513 4.52513C3 5.55025 3 7.20017 3 10.5V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H11" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7 15H11M7 11H15" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.7367 21.6527L14 22L14.3473 20.2633C14.4179 19.9106 14.5913 19.5866 14.8456 19.3323L18.9111 15.2668C19.2668 14.9111 19.8437 14.9111 20.1995 15.2668L20.7332 15.8005C21.0889 16.1563 21.0889 16.7332 20.7332 17.0889L16.6677 21.1544C16.4134 21.4087 16.0894 21.5821 15.7367 21.6527Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <div className='bg-[#F0F1EC] w-[44px] h-[44px] flex items-center justify-center rounded-full cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" stroke="#121212" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4 7H20" stroke="#121212" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className='pt-6 flex items-center gap-2'>
                                <img src={Profilegroup} alt='Profilegroup' className='block' />
                                <p className='text-base font-medium text-black700'>
                                    Trusted by <span className='text-primary'> 70K+ </span> investors & traders with a  <span className='text-primary'> 4.8 out of 5 </span> rating
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10 w-full ">
                            <img src={FramImage} alt='FramImage' />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}