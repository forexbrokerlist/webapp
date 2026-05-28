import React from 'react'
import ExpoBanner from './expo-banner'
import FintechExhibition from './fintech-exhibition'
import TourCity from './tour-city'
import Recap from './recap'
import ExhibitorNews from './exhibitorNews'
import ExhibitorField from './exhibitorField'
import { db } from '~/services/db'
import Serveworld from './serveworld'
import { getTrustedPlatforms } from '~/server/web/brokers/queries'

export default async function page() {
  const tourCities = await db.expo_tourcity.findMany({
    orderBy: {
      starting_date: 'asc'
    }
  })

  const recap = await db.expo_history.findMany()

  const allNews = await db.expo_news.findMany()
  const exhibitorNews = allNews
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const countryData = await db.expo_countrydata.findMany()

  // ✅ Fetch brokers here in server component
  const brokers = await getTrustedPlatforms(10)

  return (
    <div>
      <ExpoBanner />
      <FintechExhibition brokers={brokers} /> {/* ✅ pass as prop */}
      <TourCity tourCities={tourCities} />
      <Recap recap={recap} />
      <ExhibitorNews news={exhibitorNews} />
      {/* <ExhibitorField /> */}
      <Serveworld countryData={countryData} />
    </div>
  )
}