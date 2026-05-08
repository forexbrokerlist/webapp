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
import CrmEnquiry from './crm-enquiry'
import { findRandomAlgoProviders, findRandomBridgeProviders, findRandomLiquidityProviders, findRandomPSPPartners, findRandomTradingPlatforms } from '~/server/web/tools/queries'

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

    // Fetch integration partners
    const [rawTrading, rawBridge, rawLiquidity, rawPSP, rawAlgo] = await Promise.all([
        findRandomTradingPlatforms(20),
        findRandomBridgeProviders(20),
        findRandomLiquidityProviders(20),
        findRandomPSPPartners(20),
        findRandomAlgoProviders(20)
    ]);

    const processLogos = async (brokers: any[]) => {
        return Promise.all(brokers.map(async (broker) => ({
            ...broker,
            logoUrl: await getPresignedUrlFromFull(broker.logoUrl)
        })));
    }

    const [tradingPlatforms, bridgeProviders, liquidityProviders, pspPartners, algoProviders] = await Promise.all([
        processLogos(rawTrading),
        processLogos(rawBridge),
        processLogos(rawLiquidity),
        processLogos(rawPSP),
        processLogos(rawAlgo)
    ]);

    return (
        <div>
            <ForexBanner />
            <ClientLogo logos={LogoPartners} />
            <OurService />
            <ForexBusiness />
            <CoreProduct />
            <OurIntegration 
                tradingPlatforms={tradingPlatforms}
                bridgeProviders={bridgeProviders}
                liquidityProviders={liquidityProviders}
                pspPartners={pspPartners}
                algoProviders={algoProviders}
            />
            <WhyChoose />
            <ClientSay />
            <CrmEnquiry />
            <StartTrading />
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
        </div>
    )
}
