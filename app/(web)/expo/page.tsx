import React from 'react'
import ExpoBanner from './expo-banner'
import FintechExhibition from './fintech-exhibition'
import TourCity from './tour-city'
import Recap from './recap'
import ExhibitorNews from './exhibitorNews'
import ExhibitorField from './exhibitorField'
import { db } from '~/services/db'
import Serveworld from './serveworld'

export default async function page() {
    const tourCities = await db.expo_tourcity.findMany({
        orderBy: {
            starting_date: 'asc'
        }
    });
       const recap = await db.expo_history.findMany();

       const allNews = await db.expo_news.findMany();
       // Shuffle and pick 3 random news items
       const exhibitorNews = allNews
           .sort(() => Math.random() - 0.5)
           .slice(0, 3);
         
           const countryData = await  db.expo_countrydata.findMany()
    return (
        <div>
            <ExpoBanner />
            <FintechExhibition />
            <TourCity tourCities={tourCities} />
            <Recap recap={recap}/>
            <ExhibitorNews news={exhibitorNews} />
            {/* <ExhibitorField /> */}
            <Serveworld countryData={countryData}/> 
        </div>
    )
}
