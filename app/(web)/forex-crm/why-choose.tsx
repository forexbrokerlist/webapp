import React from 'react'
const EarthBanner = '/assets/images/earth.svg';
const ChooseIcon = '/assets/images/choose.svg';
export default function WhyChoose() {
    return (
        <div className='pb-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[60px]'>
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                            Why GENXEL
                        </button>
                    </div>
                    <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        Why Choose Forex Broker List
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        RejoiceFX empowers forex brokers and traders with an all-in-one ecosystem combining advanced technology, automation, and expert support
                        to launch, manage, and scale brokerage businesses without complexity.
                    </p>
                </div>
                <div className='grid grid-cols-3 items-center gap-10'>
                    <div className='grid grid-cols-1 gap-8'>
                        {[
                            ...Array(3)
                        ].map((_, i) => {
                            return (
                                <div className='border-[rgba(168,221,21,0.50)] grid grid-cols-[40px_1fr] gap-5 p-5 border rounded-lg border-solid bg-white'>
                                    <img src={ChooseIcon} alt="ChooseIcon" className='block ' />
                                    <div>
                                        <h3 className='text-xl font-semibold mb-2.5 text-black100'>
                                            Why Choose Forex Broker
                                        </h3>
                                        <p className='text-lg text-black700 font-medium'>
                                            GENXEL helps forex brokers launch and scale businesses
                                            with technology and automation.
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <img className='block w-full' src={EarthBanner} alt="EarthBanner" />
                    </div>
                    <div className='grid grid-cols-1 gap-8'>
                        {[
                            ...Array(3)
                        ].map((_, i) => {
                            return (
                                <div className='border-[rgba(168,221,21,0.50)] grid grid-cols-[1fr_40px] gap-5 p-5 border rounded-lg border-solid bg-white'>

                                    <div>
                                        <h3 className='text-xl font-semibold mb-2.5 text-black100'>
                                            Why Choose Forex Broker
                                        </h3>
                                        <p className='text-lg text-black700 font-medium'>
                                            GENXEL helps forex brokers launch and scale businesses
                                            with technology and automation.
                                        </p>
                                    </div>
                                    <img src={ChooseIcon} alt="ChooseIcon" className='block ' />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
