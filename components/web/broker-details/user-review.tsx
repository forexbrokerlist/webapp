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

const QuoteMark = () => (
    <svg width="50" height="42" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-4 opacity-[0.25]">
        <path d="M22 0V18H14C14 26 18 34 26 40L20 48C8 38 0 24 0 10V0H22ZM60 0V18H52C52 26 56 34 64 40L58 48C46 38 38 24 38 10V0H60Z" fill="#E6D3B3" />
    </svg>
);

const StarIcon = ({ fillPercentage }: { fillPercentage: number }) => (
    <div className="relative inline-block w-4 h-4 shrink-0">
        {/* Empty Star (Gray) */}
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#E2E8F0"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0"
        >
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
        </svg>
        {/* Filled Star (Yellow) clipped by width */}
        <div
            className="absolute top-0 left-0 overflow-hidden h-full"
            style={{ width: `${fillPercentage}%` }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#FBA100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
            </svg>
        </div>
    </div>
);

export default function UserReview({ broker }: { broker: any }) {
    if (!broker?.reviews || broker.reviews.length === 0) {
        return null;
    }

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
                    <div className='flex items-center justify-between pb-3 max-mobile:flex-col max-mobile:items-start max-mobile:gap-4'>
                        <div className='flex items-center gap-2'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                Verified Customer Feedback
                            </span>
                        </div>
                        <div className='flex items-center gap-2 shadow-[0px_0px_20px_0px_#00000014] bg-[#F59E0B] border-solid border-white border-2 p-3 rounded-full py-2 px-4'>
                            <span className='text-sm font-semibold text-white'>{broker.overall_review_rating || 4.8} Out of 5</span>

                            <span className='text-xs block py-1 px-2 bg-[#E89812] border rounded-full font-medium text-white opacity-90'>Total Reviews: {broker.total_reviews || "15 k"}</span>
                        </div>
                    </div>

                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>


                    <div className='grid grid-cols-3 max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-4 pb-5 pt-4 border-b border-solid border-border-light300 '>
                        {broker.reviews.map((review: any, index: any) => (
                            <div key={index} className="relative overflow-hidden bg-[#f9f1e266] border border-[#EFE1C7] rounded-xl p-4 flex flex-col justify-between gap-4">
                                <QuoteMark />

                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="flex items-center gap-[2px]">
                                        {[...Array(5)].map((_, i) => {
                                            const rating = parseFloat(review.review_rat || '0');
                                            const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
                                            return (
                                                <StarIcon
                                                    key={i}
                                                    fillPercentage={fillPercentage}
                                                />
                                            );
                                        })}
                                    </div>
                                    <p className="text-[14px] leading-relaxed text-black100 font-medium">
                                        {review.review_description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-black100 font-semibold text-sm">
                                        {(review.reviewer_name || "A").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-[14px] font-semibold text-black100">{review.reviewer_name || "Anonymous"}</h4>
                                        <span className="block text-[12px] font-medium text-black700">{review.reviewer_location || "Location not specified"}</span>
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
    )
}

