import React from 'react'
import BrokerDetailsHero from './broker-details-hero'
import BrokerDetailsView from './broker-details-view'

export default async function BrokerDetails({ broker }: { broker: any }) {
    return (
        <div>
            <BrokerDetailsHero broker={broker} />
            <BrokerDetailsView broker={broker} />
        </div>
    )
}
