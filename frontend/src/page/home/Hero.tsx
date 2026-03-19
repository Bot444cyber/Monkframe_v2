"use client";
import React from 'react';

import { ICONS } from './ts/constants';

interface HeroProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onSearchSubmit: () => void;
}

const Hero: React.FC<HeroProps> = ({ activeCategory, onCategoryChange, searchQuery, onSearchChange, searchInputRef, onSearchSubmit }) => {


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      {/* Background Gradients Removed for Clean Design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-transparent -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        {/* <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">v2.0 Now Live</span>
        </div> */}

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 animate-fade-in-up [animation-delay:100ms]">
          Build interfaces <br />
          <span className="text-zinc-400">faster than ever.</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 animate-fade-in-up [animation-delay:200ms]">
          A curated marketplace of premium UI kits, dashboard templates, and mobile app resources crafted by elite designers.
        </p>

        {/* Search Bar */}
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16 animate-fade-in-up [animation-delay:250ms] group z-20">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100 transition-all duration-700"></div>

          <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-1 md:p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 focus-within:border-white/20 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
            <div className="text-zinc-500 ml-3 md:ml-4 group-focus-within:text-white transition-colors duration-300">
              <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                <ICONS.Search />
              </div>
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for assets..."
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-zinc-600 text-sm md:text-lg py-2 md:py-3 px-2 md:px-3 tracking-wide"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="mr-2 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                type="button"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <button
              onClick={onSearchSubmit}
              className="bg-white text-black font-bold px-4 py-2 md:px-8 md:py-3 rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <span className="text-xs md:text-base">Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Hero;
