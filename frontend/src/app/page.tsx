"use client"
import React, { useState, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Product } from '@/components/ts/types';
import Pagination from '@/components/Pagination';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Search, Box, Shirt, Smartphone, Coffee, Plus, Monitor, Book, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DropdownMenu = ({ items, position = "top" }: { items: string[], position?: "top" | "bottom" }) => (
  <motion.div
    initial={{ opacity: 0, y: position === "top" ? 10 : -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: position === "top" ? 10 : -10 }}
    className={`absolute ${position === "top" ? "top-full mt-2" : "bottom-full mb-2"} left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50 normal-case tracking-normal`}
  >
    {items.map((item, i) => (
      <a
        key={i}
        href="#"
        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        {item}
      </a>
    ))}
  </motion.div>
);

function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Active hover menus logic from new UI
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkSession } = useAuth();
  const hasProcessedToken = React.useRef(false);

  React.useEffect(() => {
    const token = searchParams?.get('token');
    if (token && !hasProcessedToken.current) {
      hasProcessedToken.current = true;
      localStorage.setItem('auth_token', token);
      checkSession();
      router.replace('/');
    }
  }, [searchParams, checkSession, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${apiUrl}/api/uis?page=${page}&limit=12`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url, { credentials: 'include', cache: 'no-store', headers });
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
    const timeoutId = setTimeout(() => { fetchProducts(); }, 300);
    const interval = setInterval(() => { fetchProducts(); }, 300000);
    return () => { clearTimeout(timeoutId); clearInterval(interval); };
  }, [page, selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => products, [products]);

  // Static content from new App.tsx UI
  const categories = [
    { icon: <Box className="w-8 h-8" />, label: "Free Mockups" },
    { icon: <Shirt className="w-8 h-8" />, label: "Tshirts" },
    { icon: <Smartphone className="w-8 h-8" />, label: "Devices" },
    { icon: <Coffee className="w-8 h-8" />, label: "Mugs" },
    { icon: <Monitor className="w-8 h-8" />, label: "Hats" },
    { icon: <Book className="w-8 h-8" />, label: "Books" },
    { icon: <ShoppingBag className="w-8 h-8" />, label: "Bags" },
    { icon: <Plus className="w-8 h-8" />, label: "And More" },
  ];

  const searchPills = ["Studio", "Kit", "Packaging", "Urban"];

  const dropdownData: Record<string, string[]> = {
    Flyer: ["A4 Flyer", "US Letter", "Square Flyer", "DL Flyer"],
    Brochure: ["Bi-Fold", "Tri-Fold", "Z-Fold", "Multi-Page"],
    "Business Card": ["Standard", "Rounded", "Square", "Vertical"],
    Outdoor: ["Billboard", "Bus Stop", "Street Sign", "Poster"],
    More: ["Social Media", "Websites", "UI Kits", "Icons"],
    Bottles: ["Wine Bottles", "Beer Bottles", "Water Bottles", "Cosmetic Bottles"],
    Jars: ["Glass Jars", "Plastic Jars", "Jam Jars", "Honey Jars"]
  };

  const packagingMockups = [
    { image: "https://picsum.photos/seed/jar1/600/800" },
    { image: "https://picsum.photos/seed/jar2/600/800" },
    { image: "https://picsum.photos/seed/jar3/600/800" },
    { image: "https://picsum.photos/seed/bag1/600/800" },
    { image: "https://picsum.photos/seed/bag2/600/800" },
  ];

  const urbanMockups = [
    { category: "Poster, Urban", title: "Cylindrical street poster mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban1/800/600" },
    { category: "Signboard, Urban", title: "Hanging street signboard mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban2/800/600" },
    { category: "Urban, Flag", title: "Outdoor flags mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban3/800/600" },
    { category: "Signboard, Urban", title: "Wall mounted signboard mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban4/800/600" },
    { category: "Poster, Urban", title: "Street poster pillar mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban5/800/600" },
    { category: "Billboard, Urban", title: "Large billboard mockup", meta: "1 PSD file", image: "https://picsum.photos/seed/urban6/800/600" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Categories Section - Moved to Header */}

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 tracking-tight"
          >
            Your daily source of <span className="text-blue-600">free</span> & <span className="text-blue-600">high-quality</span> assets!
          </motion.h1>

          {/* Search Bar Container */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-full p-2 flex items-center shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex gap-1 pl-2 overflow-x-auto no-scrollbar shrink-0 max-w-[120px] sm:max-w-none">
              {searchPills.map((pill, i) => (
                <button
                  key={i}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold transition-colors bg-white text-gray-600 hover:bg-gray-100 whitespace-nowrap shrink-0`}
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="flex-1 px-4 border-l border-gray-200 ml-2 sm:ml-4 min-w-0">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search Assets"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base truncate"
              />
            </div>

            <button className="bg-white p-2.5 sm:p-3 rounded-full shadow-sm hover:bg-gray-100 transition-colors shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>
          <p className="mt-8 text-gray-400 font-medium">No redirections, highly professional elements.</p>

          {/* Sub-navigation Bar */}
          <div className="mt-16 border-t border-gray-100 pt-10">
            <div className="text-center mb-6">
              <p className="text-[15px] font-bold text-gray-800 uppercase tracking-widest">
                PREMIUM DIGITAL ASSETS <span className="mx-2 text-gray-300">—</span> HIGH-QUALITY FREE ASSETS FOR DESIGNERS
              </p>
            </div>

            <div className="border-t border-gray-100 mb-6"></div>

            <nav className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-8 gap-y-4 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4">
              {["Flyer", "Brochure", "Business Card", "Outdoor", "Book", "Stationery", "Packaging", "Poster", "More", "All"].map((item) => (
                <div
                  key={item}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setActiveDropdown(`subnav-${item}`)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => setSelectedCategory(item)}
                >
                  <div className={`flex items-center gap-1 hover:text-blue-600 transition-colors py-2 ${item === 'All' ? 'text-gray-900 font-black' : ''} ${selectedCategory === item ? 'text-blue-600' : ''}`}>
                    {item} {dropdownData[item] && <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                  <AnimatePresence>
                    {activeDropdown === `subnav-${item}` && dropdownData[item] && (
                      <DropdownMenu items={dropdownData[item]} position="bottom" />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Real Backend Data Mockup Grid */}
          <div className="mt-24">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 text-left mb-12">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <h3 className="text-2xl font-bold text-gray-800">No items found</h3>
                <p className="text-gray-500">Try selecting a different category or search term.</p>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
                  Reset Filter
                </button>
              </div>
            )}
          </div>
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

