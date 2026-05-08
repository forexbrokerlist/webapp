import { Star } from 'lucide-react'
import React from 'react'

const testimonials = [
    {
        name: "Ravi K.",
        location: "Dubai, UAE",
        text: "The IB module and MT4/MT5 integration worked perfectly from day one. KYC automation saved our compliance team a lot of manual work. Best Forex CRM we've used so far."
    },
    {
        name: "Michael T.",
        location: "London, UK",
        text: "Onboarding was done in under 48 hours and PSP integration worked out of the box. The 24/7 support team is genuinely responsive. Great all-in-one back office CRM for brokers."
    },
    {
        name: "Sara P.",
        location: "Singapore",
        text: "Role-based permissions and multi-desk management work really well for our team. Lead management helped boost our conversion noticeably. Pricing could be more transparent though."
    }
];

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
                        Here form forex broker prop firms, and trading businesses using Forex CRM to scale faster and operate smarter.
                    </p>
                </div>
                <div className='grid grid-cols-3 gap-5 max-laptop:grid-cols-2 max-mobile:grid-cols-1'>
                    {testimonials.map((item, i) => (
                        <div key={i} className='p-5 rounded-xl border border-[rgba(0,0,0,0.10)] bg-[rgba(255,255,255,0.50)] shadow-[0_0_41.145px_0_rgba(0,0,0,0.04)] flex flex-col h-full hover:shadow-lg transition-shadow duration-300'>
                            <div className='flex items-center pb-5'>
                                {[...Array(5)].map((_, starIndex) => (
                                    <Star key={starIndex} className='text-[#FFB800] fill-[#FFB800] w-5 h-5' />
                                ))}
                            </div>
                            <div className='pb-5 border-b border-solid border-border-light300 grow'>
                                <p className='text-lg font-medium text-black700 leading-relaxed'>
                                    "{item.text}"
                                </p>
                            </div>
                            <div className='pt-5 grid grid-cols-[55px_1fr] gap-4 items-center'>
                                <div className='w-[55px] h-[55px] rounded-full bg-primary flex items-center justify-center text-xl font-bold text-black100 shadow-sm'>
                                    {item.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className='text-xl text-black100 font-semibold'>
                                        {item.name}
                                    </h3>
                                    <span className='block text-black700 font-normal'>
                                        {item.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
