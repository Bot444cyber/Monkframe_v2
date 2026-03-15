"use client"
import React, { useState } from 'react';
import { Category } from './ts/types';

interface FilterBarProps {
    onCategoryChange: (category: string) => void;
}

export default function FilterBar({ onCategoryChange }: FilterBarProps) {
    const [activeCategory, setActiveCategory] = useState<string>(Category.ALL);
    const categories = Object.values(Category);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        onCategoryChange(category);
    };

    return (
        <div className="w-full sticky top-16 z-40 py-4 lg:py-5 bg-black/60 backdrop-blur-2xl border-b border-white/5 supports-[backdrop-filter]:bg-black/30">
            <div className="px-4 lg:px-10 flex items-center justify-between gap-4 max-w-[1800px] mx-auto">
                {/* Categories Scrollable List (Unified for Mobile & Desktop) */}
                <div className="relative flex-1 overflow-hidden group">
                    {/* Fade Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                    <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 lg:px-12 snap-x snap-mandatory">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`snap-center shrink-0 rounded-full px-4 py-2 lg:px-6 lg:py-2.5 text-xs lg:text-sm font-bold tracking-wide transition-all duration-300 border backdrop-blur-md ${activeCategory === category
                                    ? "bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-2 shrink-0 pl-2">
                    <button className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs lg:text-sm font-bold text-gray-400 hover:border-white/20 hover:text-white transition-all active:scale-95 uppercase tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
                        </svg>
                        <span className="hidden lg:inline">Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
