import React from 'react'
import ForexCrmDetailsHero from './forex-crm-header'
import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
export default async function ForexCrmDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    console.log("Crm broker", broker)
    return (
        <div>
            {/* <ForexCrmDetailsHero broker={broker} /> */}
            <BrokerDetailsHero broker={broker} heroFeatures={[
                { value: broker.deployment_type || '-', label: 'Deployment' },
                { value: broker.starting_price || '-', label: 'Starting Price' },
                { value: broker.bestFor?.join(', ') || '-', label: 'Best For' },
                { value: broker.demoAccount ? 'Yes' : 'No', label: 'Demo Account' }
            ]} showDemo={true} showVerified={true} showCrmPara={true}/>
            {/* <BrokerDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> */}
            <ForexCrmDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}
