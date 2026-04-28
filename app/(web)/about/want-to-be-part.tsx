import { MoveRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/common/button'
const RightImage = '/assets/images/line-frame.png';

export default function WantToBePart() {
    return (
        <div className='pb-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className="bg-[url('/assets/images/black-layer.png')] px-100 max-tab:px-10 max-mobile:px-5 max-mobile:rounded-none bg-cover bg-center bg-no-repeat rounded-3xl ">
                    <div className='grid grid-cols-[1fr_593px] max-tab:grid-cols-1 items-center'>
                        <div className='py-[60px]'>
                            <h2 className='text-[42px] max-mobile:text-3xl max-mobile:mb-2 max-mobile:leading-10 leading-normal text-white font-bold'>
                                Want to Be Part of It?
                            </h2>
                            <p className='text-lg max-mobile:text-base max-mobile:leading-6 text-white mb-7'>
                                Whether you're a broker looking to reach thousands of traders, an industry partner seeking visibility, or a trader wanting to stay informed we have a place for you.
                            </p>
                            <Button variant='primary' size='md' className={` border-none py-2.5 bg-white text-black100  flex justify-between items-center group`}>
                                Contact Us
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-black100 `}>
                                    <MoveRight className="text-white" />
                                </div>
                            </Button>
                        </div>
                        <div>
                            <img src={RightImage} alt="RightImage" className='block' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
