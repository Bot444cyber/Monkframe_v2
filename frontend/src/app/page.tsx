"use client"
import React, { useState, Suspense, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { Product } from '@/components/ts/types';
import { SearchBar } from '@/components/SearchBar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const DynamicMegaMenu = dynamic(() => import('@/components/DynamicMegaMenu'), {
  ssr: false,
});
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Pagination = dynamic(() => import('@/components/Pagination'), { ssr: false });

// ─── Dropdown Mappings ────────────────────────────────────────────────────────
const simpleDropdowns: Record<string, string[]> = {};
const navItems = ["Flyer", "Brochure", "Business Card", "Outdoor", "Book", "Stationery", "Packaging", "Poster", "More", "All"];

// ─── Fetcher ────────────────────────────────────────────────────────────────
const productFetcher = async (url: string): Promise<{ products: Product[]; totalPages: number }> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { credentials: 'include', headers });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();

  if (!data.status) throw new Error(data.message || 'API Error');

  return {
    products: data.data.map((ui: any) => ({
      id: ui.id,
      slug: ui.slug,
      title: ui.title,
      price: !ui.price || ui.price == 0 ? 'Free' : `$${ui.price}`,
      author: ui.creator?.full_name || ui.author || 'Unknown',
      category: ui.category, imageSrc: ui.imageSrc,
      sales: 0, revenue: "0", color: ui.color,
      likes: ui.likes || 0, liked: ui.liked || false, wished: ui.wished || false,
      rating: ui.rating || 4.8, fileType: ui.fileType,
      customUrl: ui.customUrl,
    })),
    totalPages: data.meta?.totalPages || 1
  };
};

// ─── Main Component ───────────────────────────────────────────────────────────
function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navSectionRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkSession } = useAuth();
  const hasProcessedToken = useRef(false);

  React.useEffect(() => {
    const token = searchParams?.get('token');
    if (token && !hasProcessedToken.current) {
      hasProcessedToken.current = true;
      localStorage.setItem('auth_token', token);
      checkSession();
      router.replace('/');
    }
  }, [searchParams, checkSession, router]);

  React.useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      const match = navItems.find((n) => n.toLowerCase() === categoryParam.toLowerCase());
      if (match) { setSelectedCategory(match); setPage(1); }
    } else {
      setSelectedCategory("All");
      setPage(1);
    }
  }, [searchParams]);

  // ─── SWR Hook for Products ───────────────────────────────────────────────
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    ...(selectedCategory && selectedCategory !== 'All' && { category: selectedCategory }),
    ...(debouncedSearch && { search: debouncedSearch })
  });

  const { data, error, isLoading, isValidating } = useSWR(
    `${apiUrl}/api/uis?${queryParams.toString()}`,
    productFetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000,
      keepPreviousData: true,
    }
  );

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const handleNavEnter = useCallback((item: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (item !== "All" || simpleDropdowns[item]) {
      const el = navItemRefs.current[item];
      const section = navSectionRef.current;
      if (el && section) {
        const eRect = el.getBoundingClientRect();
        const sRect = section.getBoundingClientRect();
        const isMega = item !== "All" && !simpleDropdowns[item];
        const menuWidth = isMega ? Math.min(720, window.innerWidth * 0.92) : 176;
        const rawCentre = eRect.left - sRect.left + eRect.width / 2;
        const halfMenu = menuWidth / 2;
        const clamped = Math.max(halfMenu, Math.min(rawCentre, sRect.width - halfMenu));
        setDropdownLeft(clamped);
      }
      setActiveDropdown(item);
    }
  }, []);

  const handleNavLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }, []);

  const keepOpen = useCallback(() => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  }, []);

  // Stable callback for SearchBar — won't change identity ever
  const handleSearchCommit = useCallback((query: string) => {
    setDebouncedSearch(query);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8 sm:pb-10 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
            Design Better With
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-blue-600 mt-1">
            Flawless Mockups
          </h2>
          <p className="mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-md mx-auto">
            Access Thousands Of High-Fidelity, Customizable Templates To Showcase Your Next Big Project. Always Free.
          </p>

          {/* Search bar — isolated component, typing never re-renders HomeContent */}
          <SearchBar onCommit={handleSearchCommit} />
        </section>

        {/* ── Sub-nav / Filter ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-2">
          <div className="text-center mb-4 sm:mb-5">
            <p className="text-[11px] sm:text-[13px] font-bold text-gray-800 uppercase tracking-widest">
              Studio Mockups
              <span className="mx-2 font-normal text-gray-300">—</span>
              <span className="font-normal text-gray-500 normal-case tracking-normal text-[11px] sm:text-[13px]">
                High-Quality Free Mockups For Designers
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 pt-3 sm:pt-4 relative" ref={navSectionRef}>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 text-[12px] sm:text-[13px] font-bold text-gray-500 uppercase tracking-widest pb-1">
              {navItems.map((item) => {
                const isAll = item === "All";
                const isActive = selectedCategory === item;
                const hasDropdown = !isAll || !!simpleDropdowns[item];

                return (
                  <div
                    key={item}
                    ref={(el) => { navItemRefs.current[item] = el; }}
                    onMouseEnter={() => handleNavEnter(item)}
                    onMouseLeave={handleNavLeave}
                  >
                    <button
                      onClick={() => {
                        setSelectedCategory(item);
                        setPage(1);
                        if (item === "All") {
                          window.history.pushState(null, '', '/');
                        } else {
                          window.history.pushState(null, '', `/?category=${encodeURIComponent(item)}`);
                        }
                      }}
                      className={`flex items-center gap-1 py-1.5 transition-colors cursor-pointer ${isAll
                        ? `px-3 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold uppercase tracking-widest ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'}`
                        : `hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
                        }`}
                    >
                      {item}
                      {!isAll && hasDropdown && <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    </button>
                  </div>
                );
              })}
            </nav>

            <AnimatePresence>
              {activeDropdown && (!["All"].includes(activeDropdown) || simpleDropdowns[activeDropdown]) && (
                <div
                  className="absolute top-full z-[100] pt-2"
                  style={{ left: dropdownLeft, transform: 'translateX(-50%)' }}
                  onMouseEnter={keepOpen}
                  onMouseLeave={handleNavLeave}
                >
                  <DynamicMegaMenu
                    category={activeDropdown}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20 min-h-[800px] relative">
          {isValidating && !isLoading && (
            <div className="absolute top-0 right-8 z-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Updating...</span>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-14">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-14">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">No items found</h3>
              <p className="text-gray-500 text-sm sm:text-base">Try selecting a different category or search term.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setDebouncedSearch(""); setPage(1); }}
                className="mt-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}
