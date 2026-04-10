"use client"
import React, { useState, Suspense, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Footer from '@/components/Footer';
import { Product } from '@/components/ts/types';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

// ─── Mega-menu ────────────────────────────────────────────────────────────────
const DynamicMegaMenu = React.memo(({ category, onClose }: { category: string; onClose: () => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchMegaMenuData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const res = await fetch(`${apiUrl}/api/uis?category=${encodeURIComponent(category)}&limit=7`);
        const data = await res.json();
        if (data.status && active) {
          setItems(data.data.map((ui: any) => {
            const rawDesc = ui.overview || 'High-fidelity mockups for your next big project.';
            let plainDesc = rawDesc.replace(/[*_~`#><=[[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
            if (plainDesc.length > 95) plainDesc = plainDesc.substring(0, 95) + '...';
            const rawTitle = ui.title || 'Untitled';
            const shortTitle = rawTitle.length > 45 ? rawTitle.substring(0, 45) + '...' : rawTitle;
            return { id: ui.id, title: shortTitle, imageSrc: ui.imageSrc, description: plainDesc };
          }));
        }
      } catch (err) {
        console.error("Failed to fetch mega menu data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMegaMenuData();
    return () => { active = false; };
  }, [category]);

  const trendingItem = items[0];
  const otherItems = items.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="mt-2 w-[92vw] max-w-[720px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden h-[300px] flex"
    >
      {loading ? (
        <div className="flex flex-col sm:flex-row w-full h-full animate-pulse bg-white">
          <div className="sm:w-64 bg-gray-100 shrink-0 h-full relative">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="w-16 h-4 bg-gray-200 rounded mb-4" />
              <div className="w-full h-6 bg-gray-200 rounded mb-2" />
              <div className="w-3/4 h-6 bg-gray-200 rounded mb-6" />
              <div className="w-full h-3 bg-gray-200 rounded mb-2" />
              <div className="w-5/6 h-3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 content-start bg-gray-50/50">
            <div className="col-span-full mb-1"><div className="w-24 h-3 bg-gray-200 rounded" /></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="flex flex-col sm:flex-row w-full h-full">
          <Link href={`/product/v1/${trendingItem.id}`} onClick={onClose} className="sm:w-64 bg-blue-600 flex flex-col justify-between shrink-0 relative overflow-hidden group">
            {trendingItem.imageSrc && (
              <img src={trendingItem.imageSrc} alt={trendingItem.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" />
            )}
            <div className="p-6 relative z-10 flex flex-col h-full bg-linear-to-t from-blue-900/40 to-transparent">
              <div>
                <span className="text-[11px] font-black text-blue-200 uppercase tracking-widest bg-blue-800/50 px-2 py-0.5 rounded backdrop-blur-sm">Trending</span>
                <h3 className="mt-4 text-[18px] font-black text-white leading-snug group-hover:text-blue-100 transition-colors" title={trendingItem.title}>{trendingItem.title}</h3>
                <p className="mt-2 text-[12px] text-blue-100/80 leading-relaxed hidden sm:block">{trendingItem.description}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-[13px] font-bold text-white group-hover:translate-x-1 transition-transform">
                Browse item →
              </div>
            </div>
          </Link>
          <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 content-start bg-gray-50/50">
            <div className="col-span-full mb-1">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Latest Uploads</p>
            </div>
            {otherItems.length > 0 ? (
              otherItems.map((item, ii) => (
                <div key={ii} className="flex flex-col gap-1">
                  <Link href={`/product/v1/${item.id}`} onClick={onClose} className="group block">
                    <h4 className="text-[13px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">View details</p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-[12px] font-bold text-gray-400">More coming soon</p>
                <p className="text-[11px] text-gray-400 mt-1">We're adding new mockups.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full bg-gray-50/50">
          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-[13px] font-bold text-gray-800">No mockups available</p>
          <p className="text-[11px] text-gray-400 mt-1">We're actively updating our {category} collection.</p>
        </div>
      )}
    </motion.div>
  );
});
DynamicMegaMenu.displayName = 'DynamicMegaMenu';

// ─── Dropdown Mappings ────────────────────────────────────────────────────────
const simpleDropdowns: Record<string, string[]> = {};
const navItems = ["Flyer", "Brochure", "Business Card", "Outdoor", "Book", "Stationery", "Packaging", "Poster", "More", "All"];

// ─── Main Component ───────────────────────────────────────────────────────────
function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navSectionRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch products — only fires when page, category, or debounced search changes
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${apiUrl}/api/uis?page=${page}&limit=12`;
      if (selectedCategory && selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;

      const res = await fetch(url, { credentials: 'include', headers });
      const data = await res.json();

      if (data.status) {
        setProducts(data.data.map((ui: any) => ({
          id: ui.id, title: ui.title,
          price: !ui.price || ui.price == 0 ? 'Free' : `$${ui.price}`,
          author: ui.creator?.full_name || ui.author || 'Unknown',
          category: ui.category, imageSrc: ui.imageSrc,
          sales: 0, revenue: "0", color: ui.color,
          likes: ui.likes || 0, liked: ui.liked || false, wished: ui.wished || false,
          rating: ui.rating || 4.8, fileType: ui.fileType,
        })));
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
    const i = setInterval(fetchProducts, 300000);
    return () => clearInterval(i);
  }, [fetchProducts]);

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
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 120);
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
          <p className="mt-4 sm:mt-5 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-md mx-auto">
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
              <span className="font-normal text-gray-400 normal-case tracking-normal text-[11px] sm:text-[13px]">
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
                          router.push('/', { scroll: false });
                        } else {
                          router.push(`/?category=${encodeURIComponent(item)}`, { scroll: false });
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
                  className="absolute top-full z-50 pt-2"
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
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-14">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-14">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">No items found</h3>
              <p className="text-gray-400 text-sm sm:text-base">Try selecting a different category or search term.</p>
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
