import React from 'react'

export default function FintechExhibition() {
    return (
        <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 '>
            <div className="bg-[url('/assets/images/black-layer.png')] px-100 max-tab:px-10 py-[50px] max-mobile:px-5 max-mobile:rounded-none bg-cover bg-center bg-no-repeat rounded-3xl">
                <div>
                    <h2 className='text-2xl capitalize text-white mb-2.5 font-semibold text-center'>
                        the world's leading fintech exhibition
                    </h2>
                    <p className='text-lg text-white opacity-70 text-center'>
                        Born in 2019 and hosted by FinTech service provider WikiGlobal, WikiEXPO
                        is a financial technology exhibition focusing on trading environment safety.
                        Emphasizing on "Diversity and Security", it integrates various industry resources and fosters healthy competition and orderly development. It is a grand industry
                        event encompassing authoritative information, industry insights, networking, and business opportunities.
                    </p>
                </div>
            </div>
        </div>
    )
}
