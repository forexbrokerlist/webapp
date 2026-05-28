"use client";

import React from 'react';
import { motion } from 'framer-motion';

import { expo_tourcity } from '~/.generated/prisma/client';

const ExpoCardImage = '/assets/images/expo-card.png';
const CyprusIcon = '/assets/images/Cyprus.svg';

export default function TourCity({ tourCities }: { tourCities: expo_tourcity[] }) {
    
    return (
        <div className='py-100 overflow-hidden max-mobile:pt-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 '>
                <div className='pb-[60px]'>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold'
                    >
                        Tour City
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className='text-lg max-mobile:text-base text-black700 text-center mx-auto font-medium max-w-[650px]'
                    >
                        Our mission is simple: to empower traders with clarity.
                        We believe that every trader whether a beginner or a seasoned professional deserves
                    </motion.p>
                </div>
                <div className='grid grid-cols-3 max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-5'>
                    {
                        tourCities.map((tour, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                                whileHover={{ y: -10 }}
                                className='border hover:border-primary border-[rgba(26,26,26,0.14)] bg-white/50 rounded-xl p-4 cursor-pointer hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300'
                            >
                                <div className="overflow-hidden rounded-t-xl">
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        src={tour.expoimg || ExpoCardImage}
                                        className='w-full rounded-t-xl block object-cover'
                                        alt={tour.city || "ExpoCardImage"}
                                    />
                                </div>
                                <div className='p-3'>
                                    <button className='border-none text-base text-black100 py-1 bg-[rgba(26,26,26,0.10)] px-4 rounded-md'>
                                        {tour.starting_date ? new Date(tour.starting_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(', ', ',') : 'TBA'}
                                    </button>
                                    <div className='flex pt-4 pb-3 items-center gap-3'>
                                        <img src={tour.flag || CyprusIcon} alt="CyprusIcon" />
                                        <h3 className='text-xl text-black100 font-semibold'>
                                           {tour.country} {tour.country&&tour.city&& '·'} {tour.city}
                                        </h3>
                                    </div>
                                    <p className='text-base text-black100 line-clamp-2'>
                                        {tour.content}
                                    </p>
                                </div>
                            </motion.div>
                        )
                       ) }
                    
                </div>
            </div>
        </div>
    )
}
