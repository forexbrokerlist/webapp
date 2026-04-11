"use client"
import { Calendar, MoveRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button';
import { useFormatter } from 'next-intl'
import { Link } from '~/components/common/link'

const BlogCardImage = '/assets/images/blog-card.png';

interface Post {
    id: string;
    title: string;
    description: string | null;
    publishedAt: Date | string | null;
    image: string | null | undefined;
    slug: string;
}

interface BlogSectionProps {
    posts?: Post[];
}

export default function BlogSection({ posts = [] }: BlogSectionProps) {
    const format = useFormatter();

    // Show real posts, fallback to empty array if none
    const displayPosts = posts.length > 0 ? posts.slice(0, 3) : [];

    return (
        <div id="blogs" className="py-20">
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        <motion.h2
                            className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Blogs
                        </motion.h2>
                        <motion.p
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px]'
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Stay informed with the latest forex broker reviews, trading tips, and market insights written
                            for traders at every level.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className='max-mobile:pt-4'
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    >
                        <Button variant='primary' size='md' className='flex items-center gap-2' asChild>
                            <Link href="/blog">
                                View More
                                <div>
                                    <MoveRight />
                                </div>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                <motion.div
                    className='grid grid-cols-3 max-tab:grid-cols-2 gap-6 max-mobile:gap-4 max-mobile:grid-cols-1'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                >
                    {
                        displayPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className='p-3.5 border border-[rgba(0,0,0,0.1)] bg-white shadow-[0_0_22.7px_0_rgba(0,0,0,0.09)] rounded-2xl cursor-pointer h-full flex flex-col'
                            >
                                <Link href={`/blog/${post.slug}`} className="contents">
                                    <div className='overflow-hidden rounded-xl'>
                                        <motion.img
                                            src={post.image || BlogCardImage}
                                            alt={post.title}
                                            className='block w-full aspect-video object-cover'
                                        />
                                    </div>
                                    <div className='pt-5 max-mobile:pt-3 flex-1 flex flex-col'>
                                        <div className='flex items-center justify-between pb-3'>
                                            <div className='text-sm max-mobile:text-xs font-semibold text-black800 py-1.5 px-3 bg-[#F0F1EC] rounded-md'>
                                                Market Analysis
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='text-black700' size={18} />
                                                <p className='text-sm max-mobile:text-xs font-medium text-black700'>
                                                    {post.publishedAt ? format.dateTime(new Date(post.publishedAt), { dateStyle: "medium" }) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <h2 className='text-xl max-mobile:text-lg text-black200 font-semibold mb-2 transition-colors hover:text-primary leading-tight line-clamp-2'>
                                            {post.title}
                                        </h2>
                                        <p className='text-base max-mobile:text-sm font-medium text-black700 line-clamp-2 mb-4'>
                                            {post.description}
                                        </p>

                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    }
                </motion.div>
            </div>
        </div>
    )
}
