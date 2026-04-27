import React from 'react'
import ForexCrmDetailsHero from './forex-crm-header'
import ForexCrmDetailsView from './forex-crm-details-view'

export default async function ForexCrmDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    console.log("Crm broker", broker)
    return (
        <div>
            <ForexCrmDetailsHero broker={broker} />
            {/* <BrokerDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> */}
            <ForexCrmDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}
