"use client";
/**
 * SearchBar — fully self-contained.
 * Internal state (query, focused, activeTab, results) never escapes to the parent.
 * The parent only gets the debounced committed value via `onCommit`.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";

// ── Tab config ────────────────────────────────────────────────────────────────
const SEARCH_TABS = [
    { label: "Everything", sort: "", filter: "" },
    { label: "Trending", sort: "trending", filter: "" },
    { label: "New Arrival", sort: "newest", filter: "" },
    { label: "PSD Files", sort: "", filter: "PSD" },
] as const;

type TabLabel = (typeof SEARCH_TABS)[number]["label"];

// ─── Fetchers ───────────────────────────────────────────────────────────────
const searchFetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    if (!data.status) return [];
    return data.data.map((ui: any) => ({
        id: ui.id,
        slug: ui.slug,
        category: ui.category,
        title: ui.title,
        imageSrc: ui.imageSrc,
        overview: ui.overview || `High-quality ${ui.category || "asset"} mockup.`,
    }));
};

const countsFetcher = async (url: string) => {
    const apiUrl = url.split("?")[0]; // Base URL
    const [aj, bj, cj, dj] = await Promise.all([
        fetch(`${apiUrl}/api/uis?limit=1`).then(r => r.json()),
        fetch(`${apiUrl}/api/uis?limit=1&sort=trending`).then(r => r.json()),
        fetch(`${apiUrl}/api/uis?limit=1&sort=newest`).then(r => r.json()),
        fetch(`${apiUrl}/api/uis?limit=1&search=PSD`).then(r => r.json()),
    ]);
    return {
        Everything: aj.meta?.total ?? 0,
        Trending: bj.meta?.total ?? 0,
        "New Arrival": cj.meta?.total ?? 0,
        "PSD Files": dj.meta?.total ?? 0,
    };
};

// ── SearchDropdown (results panel) ────────────────────────────────────────────
type DropdownProps = {
    query: string;
    activeTab: TabLabel;
    setActiveTab: (t: TabLabel) => void;
    onSelect: (title: string, id?: string, slug?: string, category?: string) => void;
};

const SearchDropdown = React.memo(({ query, activeTab, setActiveTab, onSelect }: DropdownProps) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";

    // ─── Fetch Tab Counts ────────────────────────────────────────────────────
    const { data: tabCountsData } = useSWR(`${apiUrl}/api/counts`, () => countsFetcher(apiUrl), {
        revalidateOnFocus: false,
    });
    const tabCounts = tabCountsData || { Everything: null, Trending: null, "New Arrival": null, "PSD Files": null };

    // ─── Fetch Search Results ────────────────────────────────────────────────
    const tab = SEARCH_TABS.find(t => t.label === activeTab)!;
    const terms: string[] = [];
    if (query) terms.push(query);
    if (tab.filter) terms.push(tab.filter);
    let searchUrl = `${apiUrl}/api/uis?limit=5`;
    if (terms.length > 0) searchUrl += `&search=${encodeURIComponent(terms.join(" "))}`;
    if (tab.sort) searchUrl += `&sort=${tab.sort}`;

    const { data: results, isLoading } = useSWR(
        query ? searchUrl : null, // Only fetch if there is a query, otherwise show trending maybe?
        searchFetcher,
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        }
    );

    const displayResults = results || [];
    const loading = isLoading;

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[200] py-2"
        >
            {/* Tabs */}
            <div className="flex items-center gap-2 px-4 pt-2 pb-3 overflow-x-auto no-scrollbar border-b border-gray-100">
                {SEARCH_TABS.map(tab => {
                    const isActive = activeTab === tab.label;
                    const count = tabCounts[tab.label];
                    return (
                        <button
                            key={tab.label}
                            onMouseDown={e => { e.preventDefault(); setActiveTab(tab.label as TabLabel); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap shrink-0 ${isActive ? "bg-[#0f172a] text-white" : "bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                            <span className={`text-[12px] font-medium ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                                {count === null
                                    ? <span className="inline-block w-4 h-2.5 bg-gray-200 animate-pulse rounded" />
                                    : count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            <div className="py-2 min-h-[100px]">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="w-full flex px-4 py-3 animate-pulse">
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        </div>
                    ))
                ) : displayResults.length > 0 ? (
                    displayResults.map((item: any, i: number) => (
                        <button
                            key={i}
                            onMouseDown={e => { e.preventDefault(); onSelect(item.title, item.id, item.slug, item.category); }}
                            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <div className="min-w-0 w-full">
                                <p className="text-[15px] font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors truncate leading-tight">
                                    {item.title}
                                </p>
                                <p className="text-[13px] font-medium text-gray-400 truncate mt-0.5 leading-tight">
                                    {item.overview.replace(/[*_~`#><=[[\]()]/g, " ")}
                                </p>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="py-6 text-center text-gray-400 text-sm font-medium">
                        No results found {query ? `for "${query}"` : "for this tab"}
                    </div>
                )}
            </div>
        </motion.div>
    );
});
SearchDropdown.displayName = "SearchDropdown";

// ── SearchBar (main export) ───────────────────────────────────────────────────
type SearchBarProps = {
    /** Called with the debounced query (350 ms). Parent uses this for product grid. */
    onCommit: (query: string) => void;
};

export const SearchBar = React.memo(({ onCommit }: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [activeTab, setActiveTab] = useState<TabLabel>("Everything");
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Warm the tab-count cache as soon as the search bar mounts
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
    useSWR(`${apiUrl}/api/counts`, () => countsFetcher(apiUrl), {
        revalidateOnFocus: false,
    });

    // Debounce: only notify parent after user stops typing
    useEffect(() => {
        const t = setTimeout(() => onCommit(query), 350);
        return () => clearTimeout(t);
    }, [query, onCommit]);

    // Close on outside click — uses mousedown so it fires before blur
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setFocused(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = useCallback((title: string, id?: string, slug?: string, category?: string) => {
        const identifier = slug || id;
        if (identifier) {
            router.push(`/${(category || 'mockups').toLowerCase()}/${identifier}`);
        } else {
            setQuery(title);
            onCommit(title);
        }
        setFocused(false);
    }, [router, onCommit]);

    const handleClear = useCallback(() => {
        setQuery("");
        onCommit("");
        inputRef.current?.focus();
    }, [onCommit]);

    return (
        <div ref={wrapperRef} className="mt-8 sm:mt-10 max-w-xl mx-auto relative">
            {/* Input pill */}
            <div className={`flex items-center gap-2 sm:gap-3 bg-white border rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm transition-all duration-150 ${focused ? "border-blue-600 shadow-blue-100 shadow-md" : "border-gray-200"
                }`}>
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    type="text"
                    placeholder="Search mockups, files, bundles..."
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm min-w-0"
                />
                {query && (
                    <button
                        onMouseDown={e => { e.preventDefault(); handleClear(); }}
                        className="shrink-0 text-[11px] font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-2.5 sm:px-3 py-1 rounded-full transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {focused && (
                    <SearchDropdown
                        query={query}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onSelect={handleSelect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
});
SearchBar.displayName = "SearchBar";
