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
    if (e.key === 'Enter') onSearchSubmit();
  };

  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-background">
      {/* Fine grain horizontal rule light */}
      <div className="absolute top-0 inset-x-0 h-px bg-foreground/5" />

      {/* Radial center glow — very subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,var(--foreground),transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-[80px] font-extrabold tracking-tight text-foreground leading-[1.0] mb-7 animate-fade-in-up [animation-delay:100ms]">
          Build interfaces<br />
          <span className="text-muted-foreground">faster than ever.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-14 animate-fade-in-up [animation-delay:200ms] leading-relaxed">
          A curated marketplace of premium UI kits, dashboard templates, and mobile app resources crafted by elite designers.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:250ms] group z-20">

          {/* Ambient background glow */}
          <div className="absolute -inset-1 bg-foreground/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Main Search Container - Fully rounded (pill shape) with dynamic theme interface */}
          <div className="relative flex items-center bg-background border border-border/60 rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.8)] transition-all duration-500 group-hover:border-border group-focus-within:border-foreground/30 group-focus-within:bg-background group-focus-within:shadow-[0_0_25px_rgba(var(--foreground),0.02)]">

            {/* Search Icon */}
            <div className="text-muted-foreground ml-5 group-focus-within:text-foreground transition-colors duration-300 shrink-0">
              <div className="w-5 h-5 flex items-center justify-center">
                <ICONS.Search />
              </div>
            </div>

            {/* Input Field */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search UI kits, dashboards, templates…"
              className="w-full bg-transparent border-none text-foreground focus:outline-none placeholder-muted-foreground/60 text-sm md:text-base py-3.5 px-4 tracking-wide"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="mr-2 text-muted-foreground hover:text-foreground transition-all duration-200 p-2 rounded-full hover:bg-foreground/10 active:scale-95 shrink-0"
                type="button"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Button - Matching circular aesthetic */}
            <button
              onClick={onSearchSubmit}
              className="bg-primary text-primary-foreground text-sm font-black px-8 py-3.5 rounded-full hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-300 whitespace-nowrap shadow-[0_0_10px_rgba(0,0,0,0.1)] shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
