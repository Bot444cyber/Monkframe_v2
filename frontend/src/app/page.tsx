"use client"
import React, { useState, Suspense, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import BlogCard from '@/components/BlogCard';
import { Product } from '@/components/ts/types';
import { SearchBar } from '@/components/SearchBar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const DynamicMegaMenu = dynamic(() => import('@/components/DynamicMegaMenu'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Pagination = dynamic(() => import('@/components/Pagination'), { ssr: false });

// ─── Dropdown Mappings ────────────────────────────────────────────────────────
const simpleDropdowns: Record<string, string[]> = {};
const navItems = ["Flyer", "Brochure", "Business Card", "Outdoor", "Book", "Stationery", "Packaging", "Poster", "More", "All", "Blog"];

// ─── Blog fetcher ─────────────────────────────────────────────────────────────
const blogFetcher = async (url: string): Promise<{ products: any[]; totalPages: number }> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  const data = await res.json();
  if (!data.status) throw new Error(data.message || 'API Error');
  return {
    products: data.data,
    totalPages: data.meta?.totalPages || 1
  };
};

// ─── Product Fetcher ────────────────────────────────────────────────────────
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

  const isBlog = selectedCategory === 'Blog';

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

  // Blog fetching
  const blogQueryParams = new URLSearchParams({ page: page.toString(), limit: '9', status: 'PUBLISHED' });
  const { data: blogData, isLoading: blogLoading } = useSWR(
    isBlog ? `${apiUrl}/api/blogs?${blogQueryParams.toString()}` : null,
    blogFetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  // Product fetching
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    ...(selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'Blog' && { category: selectedCategory }),
    ...(debouncedSearch && { search: debouncedSearch })
  });

  const { data, isLoading, isValidating } = useSWR(
    !isBlog ? `${apiUrl}/api/uis?${queryParams.toString()}` : null,
    productFetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000,
      keepPreviousData: true,
    }
  );

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const blogs = blogData?.products || [];
  const blogTotalPages = blogData?.totalPages || 1;

  const handleNavEnter = useCallback((item: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (item !== "All" && item !== "Blog" || simpleDropdowns[item]) {
      const el = navItemRefs.current[item];
      const section = navSectionRef.current;
      if (el && section) {
        const eRect = el.getBoundingClientRect();
        const sRect = section.getBoundingClientRect();
        const isMega = item !== "All" && item !== "Blog" && !simpleDropdowns[item];
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
            Download Free Mockup PSD
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-blue-600 mt-1 sm:mt-2">
            Templates — Download Instantly
          </h2>
          <p className="mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md sm:max-w-2xl mx-auto">
            Download free PSD mockup templates for any project — packaging, apparel, branding & devices. Commercial use allowed. No sign-up required.
          </p>
          {!isBlog && <SearchBar onCommit={handleSearchCommit} />}
        </section>

        {/* ── Sub-nav / Filter ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-2">
          <div className="text-center mb-4 sm:mb-5">
            <p className="text-[11px] sm:text-[13px] font-bold text-gray-800 uppercase tracking-widest">
              Studio Mockups
              <span className="mx-2 font-normal text-gray-300">—</span>
              <span className="font-normal text-gray-500 normal-case tracking-normal text-[11px] sm:text-[13px]">
                {isBlog ? 'Design Insights, Tutorials & Inspiration' : 'High-Quality Free Mockups For Designers'}
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 pt-3 sm:pt-4 relative" ref={navSectionRef}>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 text-[12px] sm:text-[13px] font-bold text-gray-500 uppercase tracking-widest pb-1">
              {navItems.map((item) => {
                const isAll = item === "All";
                const isBlogItem = item === "Blog";
                const isActive = selectedCategory === item;
                const hasDropdown = !isAll && !isBlogItem && !!simpleDropdowns[item] || (!isAll && !isBlogItem);

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
                        : isBlogItem
                          ? `px-3 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold uppercase tracking-widest ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white'}`
                          : `hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
                        }`}
                    >
                      {item}
                      {!isAll && !isBlogItem && hasDropdown && <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    </button>
                  </div>
                );
              })}
            </nav>

            <AnimatePresence>
              {activeDropdown && (![" All", "Blog"].includes(activeDropdown) || simpleDropdowns[activeDropdown]) && (
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

        {/* ── Blog Grid ── */}
        {isBlog && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16 sm:pb-20 min-h-[600px]">
            {/* Blog section header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Latest Articles</h2>
                <p className="text-gray-500 text-sm mt-1">Design tips, tutorials, and inspiration</p>
              </div>
              <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors hidden sm:block">
                View All →
              </Link>
            </div>
            {blogLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/9] bg-gray-100 rounded-2xl mb-4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-3" />
                    <div className="h-5 bg-gray-100 rounded-xl w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded-xl w-full mb-1" />
                    <div className="h-4 bg-gray-100 rounded-xl w-2/3" />
                  </div>
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                  {blogs.map((blog: any) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
                <div className="mt-12">
                  <Pagination currentPage={page} totalPages={blogTotalPages} onPageChange={setPage} />
                </div>
              </>
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">No articles yet</h3>
                <p className="text-gray-500 text-sm">Check back soon for design tips and inspiration.</p>
              </div>
            )}
          </section>
        )}

        {/* ── Product Grid ── */}
        {!isBlog && (
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
        )}

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
