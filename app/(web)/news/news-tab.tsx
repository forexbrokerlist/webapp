import React from 'react'

export default function NewsTab() {
    return (
        <div className='flex items-center gap-2'>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Latest
            </button>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Original
            </button>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Industry
            </button>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Broker
            </button>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Forex Encyclopedia
            </button>
            <button className='border border-solid rounded-full cursor-pointer border-border-light300 bg-white py-2 hover:bg-primary transition-all ease-linear duration-300 px-5 text-base font-medium text-black100'>
                Broker Encyclopedia
            </button>
        </div>
    )
}
