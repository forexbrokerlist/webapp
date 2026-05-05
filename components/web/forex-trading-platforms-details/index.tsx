import React from 'react'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
import ForexTradingPlatformsView from './forex-trading-platforms-view'

export default async function ForexTradingPlatformsDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
  
    return (
        <div>
            <BrokerDetailsHero broker={broker} heroFeatures={[
                { value: broker.clients_count || '-', label: `Brokers Onboarded ${new Date().getFullYear()}` },
                { value: broker.white_label_price || '-', label: 'White Label/Month' },
                { value: broker.trader_accounts || '-', label: 'Trader Accounts' },
                { value: broker.setup_time || '-', label: `Setup & Launch Time` },
            ]} showDemo={true} showVerified={true} showCrmPara={true}/>
            <ForexTradingPlatformsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}

