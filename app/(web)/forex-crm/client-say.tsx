import { Star } from 'lucide-react'
import React from 'react'
const ProfileImage = '/assets/images/profile.png';
export default function ClientSay() {
    return (
        <div className='pb-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[60px]'>
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                            Testimonials
                        </button>
                    </div>
                    <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        What Our Client Say
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        Here form forex broker prop firms, and trading businesses using GENXEL to scale faster and operate smarter.
                    </p>
                </div>
                <div className='grid grid-cols-3 gap-5'>
                    {
                        [...Array(3)]?.map((_, i) => {
                            return (
                                <div className='p-5 rounded-xl border border-[rgba(0,0,0,0.10)] bg-[rgba(255,255,255,0.50)] shadow-[0_0_41.145px_0_rgba(0,0,0,0.04)]'>
                                    <div className='flex items-center pb-5'>
                                        <Star className='text-[#FFB800]' />
                                        <Star className='text-[#FFB800]' />
                                        <Star className='text-[#FFB800]' />
                                        <Star className='text-[#FFB800]' />
                                        <Star className='text-[#FFB800]' />
                                    </div>
                                    <div className='pb-5 border-b border-solid border-border-light300'>
                                        <p className='text-lg font-medium text-black700 line-clamp-3'>
                                            I tried multiple AI detection tools, but this free AI checker gave the most accurate results. It detected AI generated content instantly and provided a detailed AI probability score.
                                            Highly recommended.
                                        </p>
                                    </div>
                                    <div className='pt-5 grid grid-cols-[55px_1fr] gap-4 items-center'>
                                        <img className='block w-[55px] h-[55px] rounded-full' src={ProfileImage} alt="ProfileImage" />
                                        <div>
                                            <h3 className='text-xl text-black100 font-semibold'>
                                                Michael T., Texas
                                            </h3>
                                            <span className='block text-black700 font-normal'>
                                                Perfect AI Writing Detection for Students
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
