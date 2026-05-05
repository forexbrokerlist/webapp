import React from 'react'
// import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
import ForexAlgoProviderDetailView from './forex-algo-provide-detail-view'
// import ForexBridgeProviderDetailsView from './forex-bridge-detail-view'
// import ForexTradingCourseDetailsView from './forex-trading-course-details-view'

export default function ForexAlgoProviderDetails({ broker,randomBrokers,trustedBrokers }: { broker: any,randomBrokers:any[],trustedBrokers:any[] }) {
   
    return (
       <div>
       <BrokerDetailsHero broker={broker} showCrmPara={true} showClients={true} heroFeatures={[
                { value: (broker.bot_type || '-').replace(/\s*\([^)]*\)/g, ''), label: 'Bot Type' },
                { value: (broker.win_rate || '-').replace(/\s*\([^)]*\)/g, ''), label: 'Win Rate' },
                
                { value: broker.year_established || '-', label: 'Founded' },
                { value: broker.clients_count+" + " || '-', label: 'Clients' },
               
            ]}/>
       <ForexAlgoProviderDetailView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> 
       </div>

    )
}
