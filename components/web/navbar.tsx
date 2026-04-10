import React from 'react'
import { FullLogo } from './ui/full-logo'
import { User } from 'lucide-react';
import { Button } from '../common/button';

export default function Navbar() {
    const NAV_ITEMS = [
        { label: 'Home', href: '#' },
        { label: 'Browse', href: '#' },
        { label: 'Broker', href: '#' },
        { label: 'Tools', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Advertise', href: '#' },
    ];

    return (
        <header className='py-5 fixed top-0 left-0 w-full z-[9]'>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto flex items-center justify-between'>
                <div>
                    <FullLogo className="h-6 max-w-[175px] w-full" />
                </div>
                <div className='bg-white flex items-center gap-2 rounded-full p-1.5'>
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className='block py-2 px-5 text-base font-medium text-black100 rounded-full hover:bg-primary transition-all duration-300'
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
                {/* Right side items (e.g. Profile / Sign in) can be added here */}
                <div className='flex items-center gap-3'>
                    <div className='w-[50px] h-[50px] border cursor-pointer bg-white border-solid border-border-light transition-all duration-300 hover:border-primary flex items-center justify-center rounded-full'>
                        <User className='text-black100 w-6 h-6' />
                    </div>
                    <Button size="md" variant="primary" className='px-7'>
                        Sign In
                    </Button>
                </div>
            </div>
        </header>
    )
}
