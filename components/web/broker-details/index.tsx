import React from 'react'
import BrokerDetailsHero from './broker-details-hero'
import BrokerDetailsView from './broker-details-view'

export default async function BrokerDetails({ broker, randomBrokers, trustedBrokers }: { broker: any, randomBrokers: any[], trustedBrokers: any[] }) {
    return (
        <div>
            <BrokerDetailsHero broker={broker} />
            <BrokerDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}
