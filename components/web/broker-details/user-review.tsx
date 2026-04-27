import React from 'react'
import { Button } from '~/components/common/button';
const RoundIcon = '/assets/images/round.svg';
const CounterIcon = '/assets/images/counter.svg';

const ratings = [
    { label: "Spreads", score: 4.8 },
    { label: "Platform", score: 4.7 },
    { label: "Support", score: 4.1 },
    { label: "Withdrawal", score: 4.5 }
];

const reviews = [
    {
        name: "Priya Sharma",
        date: "Mumbai, India March 2026..",
        rating: 4,
        text: "“Spreads are excellent - 0.0 pips on the Razor account. Withdrawal was very fast, INR received in bank Profile within 24 hours. MT5 platform runs smoothly. Highly recommend for scalping.”",
        avatar: "/assets/images/Sneha.svg"
    },
    {
        name: "Sneha P.",
        date: "Ahmedabad, India, Februa..",
        rating: 4,
        text: "“Copy trading feature works very well. The only issue is the demo account is limited to 60 days. Support is 24/7 available and live chat responds quickly. Overall a great experience”",
        avatar: "/assets/images/Sneha.svg"
    },
    {
        name: "Mihir V.",
        date: "Surat, India January 2026..",
        rating: 4,
        text: "“Best broker for scalping. Execution speed is exceptional, slippage is almost zero. I prefer cTrader platform with the Razor account. Been using it for 3 years. Best broker for scalping. Execution speed.”",
        avatar: "/assets/images/Sneha.svg"
    },
    {
        name: "Priya Sharma",
        date: "Mumbai, India March 2026..",
        rating: 4,
        text: "“Spreads are excellent - 0.0 pips on the Razor account. Withdrawal was very fast, INR received in bank Profile within 24 hours. MT5 platform runs smoothly. Highly recommend for scalping.”",
        avatar: "/assets/images/Sneha.svg"
    },
    {
        name: "Priya Sharma",
        date: "Mumbai, India March 2026..",
        rating: 4,
        text: "“Spreads are excellent - 0.0 pips on the Razor account. Withdrawal was very fast, INR received in bank Profile within 24 hours. MT5 platform runs smoothly. Highly recommend for scalping.”",
        avatar: "/assets/images/Sneha.svg"
    },
    {
        name: "Priya Sharma",
        date: "Mumbai, India March 2026..",
        rating: 4,
        text: "“Spreads are excellent - 0.0 pips on the Razor account. Withdrawal was very fast, INR received in bank Profile within 24 hours. MT5 platform runs smoothly. Highly recommend for scalping.”",
        avatar: "/assets/images/user1.svg"
    }
];

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#FBA100" : "#E2E8F0"} xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
    </svg>
);

const QuoteMark = () => (
    <svg width="50" height="42" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-4 opacity-[0.25]">
        <path d="M22 0V18H14C14 26 18 34 26 40L20 48C8 38 0 24 0 10V0H22ZM60 0V18H52C52 26 56 34 64 40L58 48C46 38 38 24 38 10V0H60Z" fill="#E6D3B3" />
    </svg>
);

export default function UserReview() {
    return (
        <div id='user-review' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    USER REVIEWS
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                    <div className='flex items-center gap-2 pb-3'>
                        <img src={RoundIcon} alt="RoundIcon" className='block' />
                        <span className='block text-base font-medium text-black'>
                            Verified Customer Feedback
                        </span>
                    </div>
                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                    <div className='pt-5 pb-2'>
                        <div className='grid pb-5 grid-cols-[160px_1fr] gap-12 items-center'>
                            <div>
                                <div className='flex justify-center pb-3'>
                                    <img src={CounterIcon} alt="CounterIcon" className='block' />
                                </div>
                                <p className='text-base font-medium text-black100 text-center'>
                                    Total Reviews: 15K
                                </p>
                            </div>
                            <div className='flex flex-col gap-3.5'>
                                {ratings.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <span className="w-[85px] text-base font-medium text-black700 shrink-0">
                                            {item.label}
                                        </span>
                                        <div className="flex-1 h-[8px] bg-[#FCF2E1] rounded-full">
                                            <div
                                                className="h-full bg-[#FBA100] rounded-full"
                                                style={{ width: `${(item.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-6 text-base font-medium text-black700 text-right shrink-0">
                                            {item.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 pb-5 border-b border-solid border-border-light300'>
                            {reviews.map((review, index) => (
                                <div key={index} className="relative overflow-hidden bg-[#f9f1e266] border border-[#EFE1C7] rounded-xl p-4 flex flex-col justify-between gap-4">
                                    <QuoteMark />

                                    <div className="relative z-10 flex flex-col gap-3">
                                        <div className="flex items-center gap-[2px]">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon key={star} filled={star <= review.rating} />
                                            ))}
                                        </div>
                                        <p className="text-[14px] leading-relaxed text-black100 font-medium">
                                            {review.text}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-3">
                                        <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover bg-[#E2E8F0]" />
                                        <div>
                                            <h4 className="text-[14px] font-semibold text-black100">{review.name}</h4>
                                            <span className="block text-[12px] font-medium text-black700">{review.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='pt-4 flex items-center justify-between hidden'>
                            <p className='text-base text-black100 font-medium'>
                                Showing 3 of 15,000+ verified reviews
                            </p>
                            <Button variant='secondary' className='flex items-center gap-2 text-sm'>
                                Write a Review
                                <div className='flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                        <path d="M17.0221 9.5013C17.0221 13.6549 13.6549 17.0221 9.5013 17.0221C8.21239 17.0221 6.99916 16.6979 5.9388 16.1265C4.45979 15.3296 3.46454 16.0705 2.58682 16.2034C2.45368 16.2236 2.32108 16.1752 2.22586 16.0801C2.08133 15.9355 2.05382 15.712 2.13366 15.5238C2.47815 14.7119 2.79446 13.1732 2.36317 11.8763C2.11489 11.1298 1.98047 10.3312 1.98047 9.5013C1.98047 5.34766 5.34766 1.98047 9.5013 1.98047C13.6549 1.98047 17.0221 5.34766 17.0221 9.5013Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.10536 11.9972L6.73047 12.2721L7.00544 10.8972C7.06129 10.618 7.19855 10.3615 7.39993 10.1602L10.6184 6.94172C10.9 6.66005 11.3567 6.66005 11.6384 6.94172L12.0609 7.36422C12.3425 7.64588 12.3425 8.10259 12.0609 8.38418L8.8424 11.6027C8.64108 11.804 8.38458 11.9413 8.10536 11.9972Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

