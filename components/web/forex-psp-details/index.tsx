import React from 'react'
import ForexPSPDetailsView from './forex-psp-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'

export default async function ForexPSPDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
  
    return (
        <div>
            {/* <ForexCrmDetailsHero broker={broker} /> */}
            <BrokerDetailsHero broker={broker} heroFeatures={[
                { value: broker.broker_name || '-', label: 'Name' },
                { value: broker.headquarters || '-', label: 'Headquarters' },
                { value: broker.year_established || '-', label: 'Est' },
                { value: broker.overall_rating ? broker.overall_rating + '/5' : '-', label: 'Score' }
            ]} showDemo={true} showVerified={true} showCrmPara={true}/>
            {/* <BrokerDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> */}
            <ForexPSPDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
        </div>
    )
}

