"use client"
import React, { useState, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/page/home/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import SocialProof from '@/components/SocialProof';
import { Product } from '@/components/ts/types';
import { Category } from '@/page/home/ts/types';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// ... imports
import Pagination from '@/components/Pagination';

const LOGO_NAMES = ["Stripe", "Airbnb", "Spotify", "Netflix", "Slack", "Discord", "Figma", "Notion", "Linear", "Vercel"];

function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = React.useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const sortOptions = ["Popularity", "Newest"];

  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkSession } = useAuth();

  const hasProcessedToken = React.useRef(false);

  // Handle Token from Redirect
  React.useEffect(() => {
    const token = searchParams?.get('token');
    if (token && !hasProcessedToken.current) {
      hasProcessedToken.current = true;
      localStorage.setItem('auth_token', token);
      checkSession();
      // Clean URL
      router.replace('/');
    }
  }, [searchParams, checkSession, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `${apiUrl}/api/uis?page=${page}&limit=12`;

      const isSortCategory = ['Trending', 'Newest'].includes(selectedCategory);

      if (isSortCategory) {
        url += `&sort=${selectedCategory.toLowerCase()}`;
      } else if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url, {
        credentials: 'include',
        cache: 'no-store',
        headers: headers
      });
      const data = await res.json();

      if (data.status) {
        const mapped = data.data.map((ui: any) => ({
          id: ui.id,
          title: ui.title,
          price: !ui.price || ui.price == 0 ? 'Free' : `$${ui.price}`,
          author: ui.creator?.full_name || ui.author || 'Unknown',
          category: ui.category,
          imageSrc: ui.imageSrc,
          sales: 0,
          revenue: "0",
          color: ui.color,
          likes: ui.likes || 0,
          liked: ui.liked || false,
          wished: ui.wished || false,
          rating: ui.rating || 4.8,
          fileType: ui.fileType
        }));
        setProducts(mapped);
        setTotalPages(data.meta?.totalPages || 1);
        setTotalItems(data.meta?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce for search

    // Polling every 5 minutes
    const interval = setInterval(() => {
      fetchProducts();
    }, 300000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [page, selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  const handleSearchSubmit = () => {
    const element = document.getElementById('explore');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Header />
      <main className="flex-1">
        <Hero
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          onSearchSubmit={handleSearchSubmit}
        />

        <section id="explore" className="py-16 md:py-24 px-4 md:px-8 lg:px-12 max-w-[1800px] mx-auto min-h-screen">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-border">
            <div className="relative">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-transparent rounded-full blur-[100px] pointer-events-none" />
              <h2 className="relative text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-3">
                {selectedCategory === 'All' ? 'All Designs' : `${selectedCategory} Templates`}
              </h2>
              <p className="text-muted-foreground font-medium text-lg max-w-xl">
                Discover {totalItems || filteredProducts.length} premium resources crafted for modern interfaces.
              </p>
            </div>
            <div className="relative z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-card hover:bg-foreground/5 border border-border hover:border-border/50 rounded-xl px-5 py-2.5 transition-all duration-200 group"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Sort by:</span>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{sortBy}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-20 p-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${sortBy === option
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, idx) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : (
            <div className="py-40 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">No items found</h3>
              <p className="text-muted-foreground/60">Try selecting a different category or search term.</p>
              <button
                onClick={() => setSelectedCategory(Category.ALL)}
                className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* ── Logo Loop ── */}
          <div className="mt-24 pt-10 pb-6 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-5">
              <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
                Trusted by teams at
              </p>
            </div>
            <div className="relative flex overflow-hidden">
              <div
                className="flex whitespace-nowrap gap-16 items-center"
                style={{ animation: 'logoScroll 30s linear infinite' }}
              >
                {[...LOGO_NAMES, ...LOGO_NAMES].map((logo, i) => (
                  <span key={i} className="text-2xl md:text-3xl font-black text-muted-foreground/40 hover:text-foreground transition-colors cursor-default select-none">
                    {logo}
                  </span>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
            <style>{`@keyframes logoScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
          </div>

        </section>

        <SocialProof />

        <div id="contact">
          <Footer />
        </div>
      </main>
    </div >
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}
