"use client"
import React, { useState, useMemo, Suspense, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Product } from '@/components/ts/types';
import Pagination from '@/components/Pagination';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MegaMenuData {
  trending: { title: string; description: string };
  columns: { heading: string; items: string[] }[];
}

// ─── Mega-menu dropdown ───────────────────────────────────────────────────────
// NOTE: positioning (left / translateX) is handled by the parent wrapper in the
// JSX — these classes only control size, shadow, and layout.
const MegaMenu = ({ data, onClose }: { data: MegaMenuData; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.18 }}
    className="mt-2 w-[92vw] max-w-[720px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden"
  >
    <div className="flex flex-col sm:flex-row">
      {/* Trending card */}
      <div className="sm:w-52 bg-amber-400 p-6 flex flex-col justify-between shrink-0">
        <div>
          <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Trending</span>
          <h3 className="mt-2 text-[18px] font-black text-white leading-snug">{data.trending.title}</h3>
          <p className="mt-2 text-[13px] text-amber-100 leading-relaxed hidden sm:block">{data.trending.description}</p>
        </div>
        <a href="#" onClick={onClose} className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-white hover:underline">
          Browse collection →
        </a>
      </div>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 divide-x divide-gray-100">
        {data.columns.map((col, ci) => (
          <div key={ci} className="px-5 py-5">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.items.map((item, ii) => (
                <li key={ii}>
                  <a href="#" onClick={onClose} className="block text-[14px] text-gray-600 hover:text-amber-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Simple list dropdown ─────────────────────────────────────────────────────
const SimpleDropdown = ({ items, onClose }: { items: string[]; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.18 }}
    className="mt-2 w-52 bg-white border border-gray-100 shadow-xl rounded-xl py-2"
  >
    {items.map((item, i) => (
      <a
        key={i}
        href="#"
        onClick={onClose}
        className="block px-4 py-2.5 text-[14px] text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
      >
        {item}
      </a>
    ))}
  </motion.div>
);

// ─── Search Dropdown ──────────────────────────────────────────────────────────
const searchTabs = [
  { label: "Everything", count: 168 },
  { label: "Trending", count: 42 },
  { label: "New Arrival", count: 12 },
  { label: "PSD Files", count: 138 },
];

const suggestedItems = [
  { icon: "📦", title: "Ceramic Coffee Mug", desc: "Packaging kit with 5 dynamic angles." },
  { icon: "📦", title: "Premium Cardboard Box", desc: "Packaging kit with 5 dynamic angles." },
  { icon: "🪧", title: "Billboard & Urban Signs", desc: "Outdoor advertising bundle set in daylight." },
];

const SearchDropdown = ({
  query,
  activeTab,
  setActiveTab,
  onSelect,
}: {
  query: string;
  activeTab: string;
  setActiveTab: (t: string) => void;
  onSelect: (title: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50"
  >
    {/* Filter tabs — scrollable on mobile */}
    <div className="flex items-center gap-1 px-3 sm:px-4 pt-3 pb-2 border-b border-gray-100 overflow-x-auto no-scrollbar">
      {searchTabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${activeTab === tab.label
            ? 'bg-gray-900 text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
          {tab.label}
          <span className={`text-[10px] ${activeTab === tab.label ? 'text-gray-300' : 'text-gray-400'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>

    {/* Suggested results */}
    <div className="py-2">
      {suggestedItems
        .filter((s) => !query || s.title.toLowerCase().includes(query.toLowerCase()))
        .map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.title)}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0 group-hover:bg-amber-50">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 group-hover:text-amber-500 transition-colors truncate">
                {item.title}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{item.desc}</p>
            </div>
          </button>
        ))}
    </div>
  </motion.div>
);

// ─── Mega-menu data ───────────────────────────────────────────────────────────
const megaMenuData: Record<string, MegaMenuData> = {
  Flyer: {
    trending: { title: "A4 Editorial Brochures", description: "Explore our most popular high-fidelity flyer mockups, featuring fully adjustable shadows and lighting." },
    columns: [
      { heading: "Standard & DL", items: ["Single Sided", "Bi-Fold", "Tri-Fold", "Quiet-Fold", "DL Single", "DL Folded"] },
      { heading: "US Formats", items: ["US Letter Single", "US Letter Bi-Fold", "Half Letter", "Legal Size", "Legal Folded"] },
      { heading: "Square & Specialty", items: ["Square Single", "Square Bi-Fold", "Long Flyer", "Custom Die-Cut"] },
    ],
  },
  Brochure: {
    trending: { title: "Tri-Fold Premium Set", description: "Professional tri-fold brochure mockups with realistic paper textures and natural lighting." },
    columns: [
      { heading: "Classic Folds", items: ["Bi-Fold", "Tri-Fold", "Z-Fold", "Gate-Fold", "Accordion"] },
      { heading: "Sizes", items: ["A4 Portrait", "A4 Landscape", "A5 Portrait", "US Letter", "Half Letter"] },
      { heading: "Specialty", items: ["Saddle-Stitch", "Perfect Bound", "Spiral Bound", "Custom Size"] },
    ],
  },
  "Business Card": {
    trending: { title: "Rounded Edge Cards", description: "Luxury business card mockups with multi-card arrangements and premium surfaces." },
    columns: [
      { heading: "Shapes", items: ["Standard Rectangle", "Rounded Corner", "Square Format", "Vertical Format"] },
      { heading: "Finishes", items: ["Matte", "Glossy", "Foil Stamp", "Embossed", "Spot UV"] },
      { heading: "Arrangements", items: ["Single Card", "Stack View", "Fan Layout", "Pair View"] },
    ],
  },
  Outdoor: {
    trending: { title: "Urban Billboard Pack", description: "Large-format outdoor advertising mockups with real street & city environments." },
    columns: [
      { heading: "Billboards", items: ["Large Format", "Rooftop", "Highway", "Digital Billboard"] },
      { heading: "Street Level", items: ["Bus Stop", "Subway Panel", "Shop Front", "A-Frame"] },
      { heading: "Specialty", items: ["Flags & Banners", "Vehicle Wrap", "Window Decal", "Pole Sign"] },
    ],
  },
  Packaging: {
    trending: { title: "Luxury Box Collection", description: "Elegant product packaging mockups with customizable labels and premium finishes." },
    columns: [
      { heading: "Boxes", items: ["Tuck Top Box", "Mailer Box", "Gift Box", "Sleeve Box", "Display Box"] },
      { heading: "Bags & Pouches", items: ["Stand-Up Pouch", "Paper Bag", "Zip Pouch", "Kraft Bag"] },
      { heading: "Bottles & Jars", items: ["Glass Jar", "Spray Bottle", "Cosmetic Tube", "Tin Can"] },
    ],
  },
  Book: {
    trending: { title: "Editorial Book Covers", description: "Professional book and magazine mockups with realistic paper textures, spines, and natural lighting." },
    columns: [
      { heading: "Book Types", items: ["Hardcover", "Paperback", "Spiral Bound", "Ring Binder", "Journal"] },
      { heading: "Specialty", items: ["Coffee Table Book", "Children's Book", "Comic Book", "Textbook"] },
      { heading: "Magazines", items: ["A4 Magazine", "US Letter", "Digest Size", "Square Format"] },
    ],
  },
  Stationery: {
    trending: { title: "Premium Office Suite", description: "Complete stationery sets with letterheads, envelopes, and notepads for a consistent brand look." },
    columns: [
      { heading: "Essentials", items: ["Letterhead", "Envelope", "Notepad", "Folder", "Business Card"] },
      { heading: "Desk Items", items: ["Pen & Pencil", "Sticky Notes", "Desk Pad", "Notebook"] },
      { heading: "Specialty", items: ["Invitation Card", "Gift Card", "Flyer", "Brochure"] },
    ],
  },
  Poster: {
    trending: { title: "Urban Poster Pack", description: "Striking poster mockups for events, exhibitions, and street campaigns with realistic textures." },
    columns: [
      { heading: "Standard Sizes", items: ["A1 Poster", "A2 Poster", "A3 Poster", "A4 Poster", "US Letter"] },
      { heading: "Event & Cinema", items: ["Cinema Poster", "Event Poster", "Concert Flyer", "Festival Banner"] },
      { heading: "Specialty", items: ["Vintage Style", "Minimalist", "Double-Sided", "Framed Poster"] },
    ],
  },
  More: {
    trending: { title: "Digital UI Kit", description: "Comprehensive collection of device mockups, UI kits, and social media templates." },
    columns: [
      { heading: "Digital", items: ["Social Media", "Website Hero", "App Store", "Email Header"] },
      { heading: "Devices", items: ["iPhone Mockup", "MacBook Scene", "iPad Layout", "Watch Face"] },
      { heading: "Print Ready", items: ["Poster A1", "Magazine Cover", "T-Shirt Flat", "Tote Bag"] },
    ],
  },
};

const simpleDropdowns: Record<string, string[]> = {};

const navItems = ["Flyer", "Brochure", "Business Card", "Outdoor", "Book", "Stationery", "Packaging", "Poster", "More", "All"];

// ─── Main Component ───────────────────────────────────────────────────────────
function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTab, setSearchTab] = useState("Everything");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // pixel offset of the active nav item, used to position the dropdown outside the overflow container
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navSectionRef = useRef<HTMLDivElement>(null);
  // one ref per nav item, keyed by label
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

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${apiUrl}/api/uis?page=${page}&limit=12`;
      if (selectedCategory && selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, { credentials: 'include', cache: 'no-store', headers });
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
  };

  React.useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    const i = setInterval(fetchProducts, 300000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, [page, selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => products, [products]);

  const handleNavEnter = useCallback((item: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (megaMenuData[item] || simpleDropdowns[item]) {
      const el = navItemRefs.current[item];
      const section = navSectionRef.current;
      if (el && section) {
        const eRect = el.getBoundingClientRect();
        const sRect = section.getBoundingClientRect();
        const isMega = !!megaMenuData[item];
        const menuWidth = isMega ? Math.min(640, window.innerWidth * 0.92) : 176; // 44 * 4 ≈ 176px
        const rawCentre = eRect.left - sRect.left + eRect.width / 2;
        // Clamp so the left edge is ≥ 0 and right edge ≤ section width
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8 sm:pb-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Design Better With
            </h1>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-amber-400 mt-1">
              Flawless Mockups
            </h2>
            <p className="mt-4 sm:mt-5 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-md mx-auto">
              Access Thousands Of High-Fidelity, Customizable Templates To Showcase Your Next Big Project. Always Free.
            </p>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 sm:mt-10 max-w-xl mx-auto relative"
            ref={searchWrapperRef}
          >
            <div className={`flex items-center gap-2 sm:gap-3 bg-white border rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm transition-all duration-200 ${isSearchFocused ? 'border-amber-400 shadow-amber-100 shadow-md' : 'border-gray-200'
              }`}>
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                type="text"
                placeholder="Search mockups, files, bundles..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm min-w-0"
              />
              {searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                  className="shrink-0 text-[11px] font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-2.5 sm:px-3 py-1 rounded-full transition-colors"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <AnimatePresence>
              {isSearchFocused && (
                <SearchDropdown
                  query={searchQuery}
                  activeTab={searchTab}
                  setActiveTab={setSearchTab}
                  onSelect={(title) => { setSearchQuery(title); setIsSearchFocused(false); }}
                />
              )}
            </AnimatePresence>
          </motion.div>
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

          {/* relative wrapper — dropdowns are rendered here, OUTSIDE the overflow-x div */}
          <div className="border-t border-gray-100 pt-3 sm:pt-4 relative" ref={navSectionRef}>

            {/* ▸ Wrapping nav — items flow to the next line on mobile */}
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 text-[12px] sm:text-[13px] font-bold text-gray-500 uppercase tracking-widest pb-1">
              {navItems.map((item) => {
                const isAll = item === "All";
                const isActive = selectedCategory === item;
                const hasDropdown = !!megaMenuData[item] || !!simpleDropdowns[item];

                return (
                  <div
                    key={item}
                    ref={(el) => { navItemRefs.current[item] = el; }}
                    onMouseEnter={() => handleNavEnter(item)}
                    onMouseLeave={handleNavLeave}
                  >
                    <button
                      onClick={() => { setSelectedCategory(item); setPage(1); }}
                      className={`flex items-center gap-1 py-1.5 transition-colors cursor-pointer ${isAll
                        ? `px-3 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold uppercase tracking-widest ${isActive ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-400 hover:text-white'
                        }`
                        : `hover:text-amber-500 ${isActive ? 'text-amber-500' : ''}`
                        }`}
                    >
                      {item}
                      {!isAll && hasDropdown && <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* ▸ Dropdown portal — rendered as a sibling of the scroll div so
                  overflow-x:auto cannot clip it.  Left offset is measured from
                  the hovered item's bounding rect (set in handleNavEnter). */}
            <AnimatePresence>
              {activeDropdown && (megaMenuData[activeDropdown] || simpleDropdowns[activeDropdown]) && (
                <div
                  className="absolute top-full z-50"
                  style={{ left: dropdownLeft, transform: 'translateX(-50%)' }}
                  onMouseEnter={keepOpen}
                  onMouseLeave={handleNavLeave}
                >
                  {megaMenuData[activeDropdown] ? (
                    <MegaMenu
                      data={megaMenuData[activeDropdown]}
                      onClose={() => setActiveDropdown(null)}
                    />
                  ) : (
                    <SimpleDropdown
                      items={simpleDropdowns[activeDropdown]!}
                      onClose={() => setActiveDropdown(null)}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20">
          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-400" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-14">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">No items found</h3>
              <p className="text-gray-400 text-sm sm:text-base">Try selecting a different category or search term.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setPage(1); }}
                className="mt-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-amber-400 text-white text-sm font-bold rounded-full hover:bg-amber-500 transition-all"
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
