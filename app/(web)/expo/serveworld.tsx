'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function ServeWorld({ countryData }: { countryData: any }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const [currentAllMarkers, setCurrentAllMarkers] = useState<
    mapboxgl.Marker[]
  >([])

  const isMobile =
    typeof window !== 'undefined' ? window.innerWidth < 600 : false

  const countries = countryData?.map((item: any) => ({
    name: item?.data?.countryName || item?.data?.city,
    code: item?.country_code,
  }))

  const countryDetails = countryData?.map((item: any) => {
    const [lat, lng] =
      item?.coords?.mapAddress
        ?.split(',')
        ?.map((val: string) => Number(val.trim())) || []

    return {
      name: item?.data?.countryName || item?.data?.city,
      city: [
        {
          country: item?.data?.aggData?.country?.name,
          city: item?.data?.city,
          longitude: lng,
          latitude: lat,
          expoImg: item?.data?.expoImg,
          expoCityImg: item?.data?.expoCityImg,
          status: item?.data?.status,
          content: item?.data?.content,
          flag:
            item?.data?.aggData?.country?.flag||
            'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
        },
      ],
    }
  })

  const [selectedCountry, setSelectedCountry] = useState('')

  const countryBounds = (
    countryCode: string
  ): [[number, number], [number, number]] => {
    switch (countryCode) {
      case 'IND':
        return [
          [68.1766451354, 7.96553477623],
          [97.4025614766, 35.4940095078],
        ]
      case 'EGY':
        return [
          [24.70007, 22.0],
          [36.86623, 31.58568],
        ]
      case 'SAU':
        return [
          [34.6323360532, 16.3478913436],
          [55.6666593769, 32.161008816],
        ]
      case 'ARE':
        return [
          [51.58352, 22.49695],
          [56.396847, 26.055464],
        ]
      case 'OMN':
        return [
          [52.0000098, 16.6510516],
          [59.8530105, 26.3897499],
        ]
      case 'BHR':
        return [
          [50.3365263, 25.5720789],
          [50.923759, 26.3350907],
        ]
      case 'QAT':
        return [
          [50.75, 24.5557365],
          [51.6157698, 26.2247009],
        ]
      case 'SGP':
        return [
          [103.6373214, 1.1460472],
          [104.0073545, 1.4707715],
        ]
      default:
        return [
          [-180, -85],
          [180, 85],
        ]
    }
  }

  const addCityMarkers = (cities: any[]) => {
    const markers: mapboxgl.Marker[] = []

    cities.forEach((city) => {
      if (!mapRef.current) return

      let lat = parseFloat(city.latitude)
      let lng = parseFloat(city.longitude)

      // fix swapped coordinates
      if (Math.abs(lat) > 90) {
        ;[lat, lng] = [lng, lat]
      }

      const lngLat: [number, number] = [lng, lat]

      const markerElement = document.createElement('div')
      markerElement.className = 'city-marker'

      // COMPLETE REACT-LIKE CARD INSIDE MARKER
      markerElement.innerHTML = `
        <div class="marker-wrapper">
          
          <div class="marker-dot"></div>

          <div class="expo-card">
            <div class="expo-card-inner">
 
              <div class="expo-header">
                <img 
                  src="${city.flag}" 
                  alt="${city.country}"
                  class="expo-flag"
                />

                <div class="expo-location">
                  ${city.country || 'Country'} - ${city.city || 'City'}
                </div>
              </div>

              <p class="expo-desc">
                ${city.content
          ? city.content.slice(0, 120)
          : 'No content available'
        }...
              </p>

          

            </div>
          </div>

        </div>
      `

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(lngLat)
        .addTo(mapRef.current)

      markers.push(marker)
    })

    return markers
  }

  const fitCountryBounds = (code: string) => {
    if (!mapRef.current) return

    if (code === 'SGP') {
      mapRef.current.fitBounds(countryBounds(code), {
        padding: 20,
        maxZoom: 8,
      })
    } else if (code === 'QAT' || code === 'BHR') {
      mapRef.current.fitBounds(countryBounds(code), {
        padding: isMobile ? 50 : 200,
        maxZoom: 6,
      })
    } else if (code === 'OMN' || code === 'ARE') {
      mapRef.current.fitBounds(countryBounds(code), {
        padding: isMobile ? 50 : 200,
        maxZoom: 4,
      })
    } else if (code === 'IND') {
      mapRef.current.fitBounds(countryBounds(code), {
        padding: isMobile ? 10 : 250,
        maxZoom: 4,
      })
    } else {
      mapRef.current.fitBounds(countryBounds(code), {
        padding: 30,
        maxZoom: 3,
      })
    }
  }

  useEffect(() => {
    mapboxgl.accessToken =
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [100,20],
        zoom: 1.4,
        minZoom: 1,
        attributionControl: false,
        projection: 'mercator',
      })

      mapRef.current.on('style.load', () => {
        // Set the map base background to white
        if (mapRef.current!.getLayer('background')) {
          mapRef.current!.setPaintProperty('background', 'background-color', '#ffffff');
        }
          mapRef.current!.setPaintProperty('background', 'background-color', '#ffffff')

  // Target all water layers
 
 

        mapRef.current!.addLayer({
          id: 'countries',
          source: {
            type: 'vector',
            url: 'mapbox://byfrost-articles.74qv0xp0',
          },
          'source-layer': 'ne_10m_admin_0_countries-76t9ly',
          type: 'fill',
          paint: {
            'fill-color': '#ffffff',
            'fill-outline-color': 'transparent',
          },
        })

        const style = mapRef.current!.getStyle()

        if (style && style.layers) {
          style.layers.forEach((layer) => {
            if (
              layer.type === 'symbol' ||
              layer.id.includes('label')
            ) {
              mapRef.current!.setLayoutProperty(
                layer.id,
                'visibility',
                'none'
              )
            }

            if (layer.type === 'line') {
              mapRef.current!.setLayoutProperty(
                layer.id,
                'visibility',
                'none'
              )
            }
          })
        }

        // REMOVE OLD MARKERS
        currentAllMarkers.forEach((marker) => marker.remove())

        // ADD NEW MARKERS
        const markerData = countryDetails.flatMap(
          (country: any) => country.city
        )

        const newMarkers = addCityMarkers(markerData)

        setCurrentAllMarkers(newMarkers)
      })
    }

    return () => {
      currentAllMarkers.forEach((marker) => marker.remove())
    }
  }, [])

  return (
    <>
      <div className="mb-8">
        <h2 className="text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold">
          Serve the world
        </h2>

        <p className="text-lg max-mobile:text-base text-black700 text-center mx-auto font-medium max-w-[650px]">
          Our mission is simple: to empower traders with clarity.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
          <div className="flex items-center gap-2"> <span className="w-3 h-3 rounded-full bg-lime-400 inline-block"></span> <p className="text-base font-semibold text-black"> Holding now <span className="text-gray-600 font-medium">(Last year)</span> </p> </div> <div className="hidden sm:block w-px h-5 bg-gray-300"></div> <div className="flex items-center gap-2"> <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> <p className="text-base font-semibold text-black"> Not started </p> </div> <div className="hidden sm:block w-px h-5 bg-gray-300"></div> <div className="flex items-center gap-2"> <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span> <p className="text-base font-semibold text-black"> Ended </p> </div>
        </div>
      </div>

      <style>{`
      
        .mapboxgl-ctrl-logo,
        .mapboxgl-ctrl-bottom-left,
        .mapboxgl-ctrl-bottom-right {
          display: none !important;
        }

        .mapboxgl-map,
        .mapboxgl-canvas,
        .mapboxgl-canvas-container {
          background: transparent !important;
        }

        .marker-wrapper {
          position: relative;
        }

        .marker-dot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #9eff00;
          box-shadow: 0 0 0 rgba(158,255,0,0.4);
          animation: pulse 2s infinite;
          cursor: pointer;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(158,255,0,0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(158,255,0,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(158,255,0,0);
          }
        }

        .expo-card {
          position: absolute;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%) translateY(10px);

          width: 320px;

          opacity: 0;
          visibility: hidden;

          transition: all 0.25s ease;

          z-index: 9999;
          pointer-events: none;
        }

        .marker-wrapper:hover .expo-card {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0px);
        }

        .expo-card-inner {
          background: #fff;
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .expo-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .expo-flag {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          object-fit: cover;
        }

        .expo-location {
          font-size: 15px;
          font-weight: 700;
          color: #111;
        }

        .expo-desc {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }

        .expo-btn {
          margin-top: 14px;
          background: #000;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .expo-card {
            width: 260px;
          }
          .expo-card-inner {
            padding: 12px;
            border-radius: 12px;
          }
          .expo-location {
            font-size: 13px;
          }
          .expo-desc {
            font-size: 12px;
            line-height: 1.4;
          }
          .expo-btn {
            margin-top: 8px;
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="max-w-[1640px] mx-auto px-5 mb-6">
        <div className="relative w-full h-[450px] md:h-[600px] lg:h-[800px] rounded-3xl overflow-hidden">
          <div
            ref={mapContainerRef}
            id="map"
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  )
}