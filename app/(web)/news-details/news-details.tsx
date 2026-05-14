import React from 'react'
import SocialMedia from './social-media'
import NewsUpdateCard from '../news/news-update-card';
const NewsBanner = '/assets/images/news.png';
export default function NewsDetails() {
    const latestNews = [
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
    ]
    return (
        <div className='pb-100 max-mobile:pb-16'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div className='grid grid-cols-[200px_1fr_450px] gap-10'>
                    <div>
                        <p className='text-lg font-medium mb-3 text-black100'>
                            WikiFX Express
                        </p>
                        <div className='grid grid-cols-1 gap-2 pb-[30px] border-b border-border-light300'>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    XM
                                </span>
                            </div>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    Exness
                                </span>
                            </div>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    Vantage
                                </span>
                            </div>
                        </div>
                        <p className='text-lg mt-[30px] font-medium mb-3 text-black100'>
                            WikiFX Broker
                        </p>
                        <div className='grid grid-cols-1 gap-2 pb-[30px] border-b border-border-light300'>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    Finsai Trade
                                </span>
                            </div>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    EC Markets
                                </span>
                            </div>
                            <div className='px-3 py-0.5 cursor-pointer border-l-2 border-primary'>
                                <span className='block text-base font-medium text-black700'>
                                    IC Markets Global
                                </span>
                            </div>
                        </div>
                        <p className='text-lg mt-[30px] font-medium mb-3 text-black100'>
                            Share this broker
                        </p>
                        <SocialMedia />

                    </div>
                    <div>
                        <div>
                            <img src={NewsBanner} alt="NewsBanner" className='block w-full rounded-xl' />
                        </div>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-3 text-black100'>
                            Latest Updates
                        </h2>
                        <div className='bg-[#f8f9fa] h-[844px] overflow-auto rounded-xl p-4 shadow-sm border border-border-light200'>
                            <div className='space-y-2'>
                                {latestNews.map((news, index) => (
                                    <NewsUpdateCard
                                        key={index}
                                        category={news.category}
                                        time={news.time}
                                        title={news.title}
                                        description={news.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
