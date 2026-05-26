import React from 'react'
import ExpoBanner from './expo-banner'
import FintechExhibition from './fintech-exhibition'
import TourCity from './tour-city'
import Recap from './recap'
import ExhibitorNews from './exhibitorNews'
import ExhibitorField from './exhibitorField'

export default function page() {
    return (
        <div>
            <ExpoBanner />
            <FintechExhibition />
            <TourCity />
            <Recap />
            <ExhibitorNews />
            <ExhibitorField />
        </div>
    )
}
