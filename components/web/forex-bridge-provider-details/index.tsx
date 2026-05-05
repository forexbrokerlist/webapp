import React from 'react'
// import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
import ForexBridgeProviderDetailsView from './forex-bridge-detail-view'
// import ForexTradingCourseDetailsView from './forex-trading-course-details-view'

export default function ForexBridgeProviderDetails({ broker,randomBrokers,trustedBrokers }: { broker: any,randomBrokers:any[],trustedBrokers:any[] }) {
  
    return (
       <div>
       <BrokerDetailsHero broker={broker} showCrmPara={true} heroFeatures={[
                { value: broker.solution_type || '-', label: 'Solution Type' },
                { value: broker.year_established || '-', label: 'Year Established' },
                { value: broker.headquarters || '-', label: 'Head Quarter' },
                
                { value: broker.execution_types||'-' , label: 'Execution Type' }
            ]}/>
       <ForexBridgeProviderDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> 
       </div>

    )
}
