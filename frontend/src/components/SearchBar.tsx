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

// ── Tab config ────────────────────────────────────────────────────────────────
const SEARCH_TABS = [
    { label: "Everything", sort: "", filter: "" },
    { label: "Trending", sort: "trending", filter: "" },
    { label: "New Arrival", sort: "newest", filter: "" },
    { label: "PSD Files", sort: "", filter: "PSD" },
] as const;

type TabLabel = (typeof SEARCH_TABS)[number]["label"];

// ── Module-level caches (persist across navigations / focus-blur cycles) ──────
let _tabCounts: Record<string, number | null> | null = null;
let _tabFetch: Promise<Record<string, number | null>> | null = null;
// Results cache: key = "query|tab", value = result array
const _resultsCache = new Map<string, any[]>();

function warmTabCounts(apiUrl: string) {
    if (_tabCounts) return Promise.resolve(_tabCounts);
    if (_tabFetch) return _tabFetch;
    _tabFetch = Promise.all([
        fetch(`${apiUrl}/api/uis?limit=1`).then(r => r.json()).catch(() => ({})),
        fetch(`${apiUrl}/api/uis?limit=1&sort=trending`).then(r => r.json()).catch(() => ({})),
        fetch(`${apiUrl}/api/uis?limit=1&sort=newest`).then(r => r.json()).catch(() => ({})),
        fetch(`${apiUrl}/api/uis?limit=1&search=PSD`).then(r => r.json()).catch(() => ({})),
    ]).then(([aj, bj, cj, dj]) => {
        _tabCounts = {
            Everything: aj.meta?.total ?? 0,
            Trending: bj.meta?.total ?? 0,
            "New Arrival": cj.meta?.total ?? 0,
            "PSD Files": dj.meta?.total ?? 0,
        };
        return _tabCounts;
    });
    return _tabFetch;
}

// ── SearchDropdown (results panel) ────────────────────────────────────────────
type DropdownProps = {
    query: string;
    activeTab: TabLabel;
    setActiveTab: (t: TabLabel) => void;
    onSelect: (title: string, id?: string) => void;
};

const SearchDropdown = React.memo(({ query, activeTab, setActiveTab, onSelect }: DropdownProps) => {
    const cacheKey = `${query}|${activeTab}`;

    // Seed from cache immediately — no skeleton flash for repeated queries
    const [loading, setLoading] = useState(() => !_resultsCache.has(cacheKey));
    const [results, setResults] = useState<any[]>(() => _resultsCache.get(cacheKey) ?? []);
    const [tabCounts, setTabCounts] = useState<Record<string, number | null>>(
        _tabCounts ?? { Everything: null, Trending: null, "New Arrival": null, "PSD Files": null }
    );

    // Keep a ref so the effect closure always reads the latest cacheKey
    const cacheKeyRef = useRef(cacheKey);
    cacheKeyRef.current = cacheKey;

    // Sync cached tab counts into local state once available
    useEffect(() => {
        if (_tabCounts) { setTabCounts(_tabCounts); return; }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
        let active = true;
        warmTabCounts(apiUrl).then(counts => {
            if (active) setTabCounts(counts);
        });
        return () => { active = false; };
    }, []);

    // Fetch results — skip network call if already cached
    useEffect(() => {
        const key = cacheKey;

        // Instantly show cached data, no loading state needed
        if (_resultsCache.has(key)) {
            setResults(_resultsCache.get(key)!);
            setLoading(false);
            return;
        }

        setLoading(true);
        let alive = true;
        const run = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
                const tab = SEARCH_TABS.find(t => t.label === activeTab)!;
                const terms: string[] = [];
                if (query) terms.push(query);
                if (tab.filter) terms.push(tab.filter);
                let url = `${apiUrl}/api/uis?limit=5`;
                if (terms.length > 0) url += `&search=${encodeURIComponent(terms.join(" "))}`;
                if (tab.sort) url += `&sort=${tab.sort}`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.status && alive) {
                    const mapped = data.data.map((ui: any) => ({
                        id: ui.id,
                        title: ui.title,
                        imageSrc: ui.imageSrc,
                        overview: ui.overview || `High-quality ${ui.category || "asset"} mockup.`,
                    }));
                    _resultsCache.set(key, mapped);
                    if (alive) { setResults(mapped); setLoading(false); }
                }
            } catch { /* silent */ } finally {
                if (alive) setLoading(false);
            }
        };
        // Short debounce only for new queries — cached ones are instant
        const t = setTimeout(run, 220);
        return () => { alive = false; clearTimeout(t); };
    }, [query, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

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
                        <div key={i} className="w-full flex items-center gap-4 px-4 py-3 animate-pulse">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        </div>
                    ))
                ) : results.length > 0 ? (
                    results.map((item, i) => (
                        <button
                            key={i}
                            onMouseDown={e => { e.preventDefault(); onSelect(item.title, item.id); }}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden shrink-0 group-hover:shadow-sm transition-all p-1">
                                {item.imageSrc
                                    ? <img src={item.imageSrc} alt="" className="w-full h-full object-cover rounded-lg" />
                                    : <span className="text-xl">📦</span>}
                            </div>
                            <div className="min-w-0">
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
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
        warmTabCounts(apiUrl);
    }, []);

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

    const handleSelect = useCallback((title: string, id?: string) => {
        if (id) {
            router.push(`/product/v1/${id}`);
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
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    type="text"
                    placeholder="Search mockups, files, bundles..."
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm min-w-0"
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
