import React from 'react'

interface TableOfContentsProps {
    broker?: any;
    items: string[];
    title?: string;
}

export default function TableOfContents({ broker, items, title = "Table of Contents" }: TableOfContentsProps) {
    // Conditionally filter FAQ if not present
    const filteredItems = items.filter(item => {
        if (item === "FAQ") {
            return broker?.faqs && broker.faqs.length > 0;
        }
        return true;
    });

    return (
        <div className='sticky top-[100px]'>
            <div className="rounded-xl  overflow-hidden relative p-4 border border-border-light180 bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.03)] before:absolute before:top-0 before:right-0 before:content-[''] before:w-[70px] before:h-[70px] before:rounded-full before:bg-[#a8dd15] before:blur-[100px] after:absolute after:bottom-0 after:left-0 after:content-[''] after:w-[70px] after:h-[70px] after:rounded-full after:bg-[#a8dd15] after:blur-[100px]">
                <h3 className="text-lg font-medium text-black100 mb-4 relative z-10">{title}</h3>
                <ul className="flex flex-col gap-3.5 relative z-10 m-0 p-0 list-none">
                    {filteredItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 cursor-pointer group">
                            <span className="w-[3px] h-[22px] bg-[#AEDF32] rounded-full"></span>
                            <a href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-[13px] font-medium text-black100 group-hover:text-[#AEDF32] transition-colors">{item}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
