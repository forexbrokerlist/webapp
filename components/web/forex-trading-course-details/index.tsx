import React from 'react'
// import ForexCrmDetailsView from './forex-crm-details-view'
import BrokerDetailsHero from '../broker-details/broker-details-hero'
import ForexTradingCourseDetailsView from './forex-trading-course-details-view'
export default async function ForexTradingCourseDetails({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    console.log("Crm broker", broker)
    return (
        <div>
            {/* <ForexCrmDetailsHero broker={broker} /> */}
            <BrokerDetailsHero broker={broker} heroFeatures={[
                { value: broker.skill_level[0] || '-', label: 'Skill level' },
                { value: broker?.languages_supported?.[0] || '-', label: 'Language' },
                { value: broker.year_established|| '-', label: 'Founded' },
                { value: broker.certificate_available ? 'Yes' : 'No', label: 'Certificate Available' },
               
            ]} showDemo={false} showVerified={true} showCrmPara={true} showTrialAvailable={true} showBeginnerFriendly={true} />
            <ForexTradingCourseDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />
            {/* <ForexCrmDetailsView broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} /> */}
        </div>
    )
}
