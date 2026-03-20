"use client"
import React, { useState, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/page/home/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Product } from '@/components/ts/types';
import { Category } from '@/page/home/ts/types';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// ... imports
import Pagination from '@/components/Pagination';

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
    <div className="min-h-screen flex flex-col font-sans bg-[#0a0a0a]">
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/5">
            <div className="relative">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-transparent rounded-full blur-[100px] pointer-events-none" />
              <h2 className="relative text-4xl md:text-5xl font-bold tracking-tighter text-white mb-3">
                {selectedCategory === 'All' ? 'All Designs' : `${selectedCategory} Templates`}
              </h2>
              <p className="text-zinc-400 font-medium text-lg max-w-xl">
                Discover {totalItems || filteredProducts.length} premium resources crafted for modern interfaces.
              </p>
            </div>
            <div className="relative z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-[#0a0a0a] hover:bg-[#111] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-3 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
              >
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Sort by:</span>
                <span className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">{sortBy}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-zinc-500 group-hover:text-white transition-all duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-20 p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${sortBy === option
                          ? "bg-white/10 text-white shadow-inner"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">No items found</h3>
              <p className="text-gray-500">Try selecting a different category or search term.</p>
              <button
                onClick={() => setSelectedCategory(Category.ALL)}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

          <section className="mt-32 mb-16">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-indigo-400 font-semibold tracking-wider uppercase text-xs mb-3">Community</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Loved by Designers</h2>
              <p className="text-zinc-400 max-w-2xl text-lg">
                Join thousands of creators building the future of the web with our premium assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  name: "Sarah Jenkins",
                  role: "Product Designer @ Stripe",
                  image: "S",
                  color: "bg-blue-500",
                  text: "The quality of these UI kits is unmatched. Saved me weeks of work on my latest project. The code quality is just as good as the design."
                },
                {
                  name: "Michael Chen",
                  role: "Freelance Developer",
                  image: "M",
                  color: "bg-purple-500",
                  text: "Finally, a marketplace that cares about aesthetics and functionality. The dark mode implementations are flawless. Highly recommended!"
                },
                {
                  name: "Alex Rivera",
                  role: "Founder, TechFlow",
                  image: "A",
                  color: "bg-emerald-500",
                  text: "I've purchased 5 kits so far and every single one has exceeded expectations. The customer support is also incredibly fast and helpful."
                }
              ].map((review, i) => (
                <div key={i} className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:translate-y-[-5px] animate-fade-in-up" style={{ animationDelay: `${i * 200}ms` }}>
                  <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex gap-1 mb-6 text-yellow-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-zinc-300 leading-relaxed mb-8 flex-1">"{review.text}"</p>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {review.image}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{review.name}</span>
                        <span className="text-zinc-500 text-xs">{review.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <div id="contact">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <HomeContent />
    </Suspense>
  );
}
