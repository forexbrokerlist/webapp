import React from 'react';
import { Play } from 'lucide-react';

interface CommonBannerProps {
    highlightedText?: string | null;
    title: string;
    description: string;
    image: string;
}

export default function CommonBanner({ highlightedText, title, description, image }: CommonBannerProps) {
    return (
        <div className="pt-[100px]">
            {/* Note: Removed overflow-hidden here so the border-radius sides don't get clipped! */}
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 py-8 mb-10'>

                {/* Main banner container */}
                <div className="relative w-full  isolate">

                    <div className="absolute inset-y-0 left-[2%] right-[2%] md:left-[1.5%] md:right-[1.5%] bg-white transform -skew-x-[7.5deg] border border-solid border-border-light500 rounded-[16px] z-[-1] overflow-hidden  pointer-events-none">

                    </div>

                    <div className='grid grid-cols-[1fr_408px] items-center gap-10 py-5 px-[90px]'>
                        <div className="relative z-10 w-full ">
                            <h1 className='text-[50px] mb-3 text-black100 font-bold leading-[60px] max-w-[739px]'>
                                <span className='text-[#A8DD15]'> {highlightedText} </span>
                                {title}
                            </h1>
                            <p className="text-black700 text-lg font-normal max-w-[700px]">
                                {description}
                            </p>
                        </div>

                        {/* Right Graphics */}
                        <div className="relative z-10 w-full ">

                            {/* <img src={image} alt={image} /> */}
                            <img src={image} alt={image} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
