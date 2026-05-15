import React from 'react'
import NewsHero from './news-hero'
import NewsCardList from './news-card-list'

export default function page() {
    return (
        <div>
            <NewsHero />
            <NewsCardList />
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

        </div>
    )
}
