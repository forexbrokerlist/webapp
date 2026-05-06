import React from 'react'
import ForexCrmDetailsHero from './forex-crm-header'
import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
export default async function ForexCrmDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
 
    return (
        <div>
            {/* <ForexCrmDetailsHero broker={broker} /> */}
            <BrokerDetailsHero broker={broker} heroFeatures={[
                { value: broker.deployment_type && broker.deployment_type.length > 0 && broker.deployment_type.join(",") || '-', label: 'Deployment' },
                { value: broker.starting_price || '-', label: 'Starting Price' },
                { value: broker.bestFor&& broker.bestFor.length>0 ? broker.bestFor?.join(', ') : '-', label: 'Best For' },
                { value: broker.demoAccount ? 'Yes' : 'No', label: 'Demo Account' }
            ]} showDemo={true} showVerified={true} showCrmPara={true}/>
            {/* <BrokerDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> */}
            <ForexCrmDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}
