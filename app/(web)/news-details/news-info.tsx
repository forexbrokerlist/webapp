import React from 'react'

export default function NewsInfo() {
    return (
        <div className='relative  pt-[140px] max-tab:pt-[120px]  overflow-hidden'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <button
                    className='py-1.5 border-none flex items-center gap-2 pr-4 px-3 bg-white rounded-full shadow-sm'
                >
                    <span className='bg-primary text-black100 border-none rounded-full px-2 py-1 text-sm font-semibold'>
                        News
                    </span>
                    <span className='block text-base font-medium text-black700'>
                        Market Updates
                    </span>
                </button>

                <h1
                    className='text-black100 text-[60px] max-w-[1650px] leading-[70px] my-4 font-bold max-mobile:text-[45px] max-mobile:leading-[50px] tracking-tight'
                >
                    Understanding AssetsFX Deposit and Withdrawal Methods: What You Need to Know
                </h1>
                <p className='text-lg font-medium text-black700 max-w-[1336px] mb-[60px]'>
                    Abstract：If you're looking for information about AssetsFX deposit and AssetsFX withdrawal processes, you're taking a smart step when choosing a broker. However, when it comes to AssetsFX, we need to discuss some serious concerns right away. While its website shows many modern payment options that look good, many user reports tell a very different and worrying story, especially about people
                    not being able to get their funds back. Keep reading
                </p>
            </div>
        </div>
    )
}
