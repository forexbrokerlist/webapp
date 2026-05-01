import React from 'react'
// import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
import LiquidityProviderDetailsView from './liquidity-provider-detail-view'
// import ForexTradingCourseDetailsView from './forex-trading-course-details-view'

export default function LiquidityProviderDetails({ broker,randomBrokers,trustedBrokers}: { broker: any,randomBrokers:any[],trustedBrokers:any[]}) {
    console.log("broker",broker)
    return (
       <div>
       <BrokerDetailsHero broker={broker} showCrmPara={true} heroFeatures={[
                { value: broker.solution_type || '-', label: 'Provider Type' },
                { value: broker.year_established || '-', label: 'Year Established' },
                { value: broker.headquarters || '-', label: 'Head Quarter' },
                
                { value: broker.latency||'-' , label: 'Execution Latency' }
            ]}/>
       <LiquidityProviderDetailsView broker={broker}  randomBrokers={randomBrokers} trustedBrokers={trustedBrokers}/> 
       </div>

    )
}