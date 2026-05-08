import React from 'react'
import ForexBanner from './forex-banner'
import ClientLogo from '../(home)/client-logo'
import { db } from "~/services/db"
import { getPresignedUrlFromFull } from "~/lib/media"
import OurService from './our-service'
import ForexBusiness from './forex-business'
import CoreProduct from './core-product'
import OurIntegration from './our-integration'
import WhyChoose from './why-choose'
import ClientSay from './client-say'
import StartTrading from './start-trading'

export default async function Page() {
    const LogoCategory = await db.category.findUnique({
        where: { slug: "logo-category" },
    })

    const LogoCategorySponsors = await db.sponsor.findMany({
        where: {
            categoryId: LogoCategory?.id,
            isActive: true,
        },
        orderBy: { order: "asc" },
        take: 10,
    })

    const LogoPartners = await Promise.all(
        LogoCategorySponsors.map(async (sponsor) => ({
            src: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
            alt: sponsor.name,
        }))
    )

    return (
        <div>
            <ForexBanner />
            <ClientLogo logos={LogoPartners} />
            <OurService />
            <ForexBusiness />
            <CoreProduct />
            <OurIntegration />
            <WhyChoose />
            <ClientSay />
            <StartTrading />
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
        </div>
    )
}
