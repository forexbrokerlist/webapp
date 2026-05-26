import { Pagination } from "~/components/web/pagination";

const ExpoCardImage = '/assets/images/expo-card.png';

export default function ExhibitorField() {
    return (
        <div className='pb-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 '>
                <div className='pb-[60px]'>
                    <h2 className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold'>
                        Exhibitor Field Survey
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 text-center mx-auto font-medium max-w-[650px]'>
                        Our mission is simple: to empower traders with clarity. We believe that every trader whether a beginner or a seasoned
                        professional deserves
                    </p>
                </div>
                <div className='grid grid-cols-4 gap-4'>
                    {
                        [...Array(8)].map(() => {
                            return (
                                <div className='p-2 bg-white rounded-xl border border-border-light300'>
                                    <img className="block w-full h-[248px] rounded-xl object-cover" src={ExpoCardImage} alt="ExpoCardImage" />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-black100 mb-1.5">The Forex Expo - Dubai 2025</h3>
                                        <p className="text-base text-black100 line-clamp-2">IC Markets is a globally recognized leader in the CFD industry, with over..</p>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

            </div>
        </div>
    )
}
