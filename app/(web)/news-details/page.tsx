import React from 'react'
import NewsInfo from './news-info'
import NewsDetails from './news-details'

export default function page() {
    return (
        <div>
            <NewsInfo />
            <NewsDetails />
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

        </div>
    )
}
