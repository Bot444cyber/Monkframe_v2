"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
const CATEGORIES = ['All', 'Design', 'Mockups', 'Tutorials', 'Inspiration', 'Resources', 'News'];

const CATEGORY_COLORS: Record<string, string> = {
    Design: 'bg-blue-500',
    Mockups: 'bg-violet-500',
    Tutorials: 'bg-green-500',
    Inspiration: 'bg-orange-500',
    Resources: 'bg-pink-500',
    News: 'bg-red-500',
};

const blogFetcher = async (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    if (!data.status) throw new Error(data.message);
    return { blogs: data.data as Blog[], totalPages: data.meta?.totalPages || 1 };
};

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    category?: string;
    views: number;
    createdAt: string;
    author?: { id: number; name: string };
}

/* ── Hero Skeleton ── */
function HeroSkeleton() {
    return (
        <div className="animate-pulse flex flex-col sm:flex-row h-52 sm:h-64 rounded-2xl overflow-hidden border border-gray-100 mb-8">
            <div className="sm:w-[38%] p-8 flex flex-col gap-3 bg-gray-50">
                <div className="h-3 w-16 bg-gray-200 rounded-full" />
                <div className="h-7 w-56 bg-gray-200 rounded-xl" />
                <div className="h-4 w-36 bg-gray-200 rounded-full mt-auto" />
            </div>
            <div className="flex-1 bg-gray-200" />
        </div>
    );
}

/* ── Grid Skeleton ── */
function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-gray-100 bg-white">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4 space-y-2">
                        <div className="h-2.5 w-14 bg-gray-200 rounded-full" />
                        <div className="h-5 w-4/5 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-full bg-gray-100 rounded-lg" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
                        <div className="h-3 w-28 bg-gray-100 rounded-full mt-3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Featured Hero Card ── */
function HeroCard({ blog }: { blog: Blog }) {
    const catColor = CATEGORY_COLORS[blog.category || ''] || 'bg-blue-500';
    return (
        <Link href={`/blog/${blog.slug}`} className="group flex flex-col sm:flex-row h-auto sm:h-64 rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl shadow-gray-900/5 transition-all duration-300 mb-8 bg-white">
            {/* Left: text */}
            <div className="sm:w-[38%] p-7 sm:p-10 flex flex-col justify-between bg-white">
                <div>
                    {blog.category && (
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md text-white mb-4 ${catColor}`}>
                            {blog.category}
                        </span>
                    )}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-3">
                        {blog.title}
                    </h2>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    {blog.author?.name && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {blog.author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-xs text-gray-400 font-medium">
                        {blog.author?.name && <span className="text-gray-600 font-semibold mr-1">{blog.author.name}</span>}
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Right: cover image */}
            <div className="flex-1 relative overflow-hidden min-h-48 sm:min-h-0">
                {blog.coverImage ? (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
                        <div className="text-center px-6">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Featured</p>
                            <p className="text-white font-bold text-lg leading-tight line-clamp-3">{blog.title}</p>
                        </div>
                    </div>
                )}
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </Link>
    );
}

/* ── Grid Blog Card (Freepik style: image on top with overlay title, meta below) ── */
function FreepikCard({ blog }: { blog: Blog }) {
    const catColor = CATEGORY_COLORS[blog.category || ''] || 'bg-blue-500';
    return (
        <Link href={`/blog/${blog.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg shadow-gray-900/5 transition-all duration-300 bg-white">
            {/* Image with overlay */}
            <div className="relative aspect-video overflow-hidden shrink-0">
                {blog.coverImage ? (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center p-6">
                        <p className="text-white font-bold text-sm leading-snug text-center line-clamp-3">{blog.title}</p>
                    </div>
                )}
                {/* Dark gradient + title overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-[13px] font-bold leading-snug line-clamp-2 drop-shadow-md">
                        {blog.title}
                    </p>
                </div>
            </div>

            {/* Below the image: category + title + author */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                {blog.category && (
                    <span className={`inline-flex self-start text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white ${catColor}`}>
                        {blog.category}
                    </span>
                )}
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {blog.title}
                </h3>
                {blog.excerpt && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                )}
                {/* Author row */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
                    {blog.author?.name && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                            {blog.author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        {blog.author?.name && <span className="text-gray-600 font-semibold">{blog.author.name}</span>}
                        {blog.author?.name && <span>·</span>}
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function BlogPage() {
    const [page, setPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 350);
    };

    const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };

    const params = new URLSearchParams({
        page: page.toString(), limit: '10', status: 'PUBLISHED',
        ...(activeCategory !== 'All' && { category: activeCategory }),
        ...(debouncedSearch && { search: debouncedSearch }),
    });

    const { data, isLoading } = useSWR(
        `${API_BASE_URL}/api/blogs?${params.toString()}`,
        blogFetcher,
        { revalidateOnFocus: false, keepPreviousData: true }
    );

    const blogs = data?.blogs || [];
    const totalPages = data?.totalPages || 1;

    // First blog → hero, rest → grid
    const heroBlog = blogs[0] || null;
    const gridBlogs = blogs.slice(1);

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
            <Header />
            <main className="flex-1">
                <div ref={topRef} className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-10 sm:pt-14 pb-20">

                    {/* ── Top bar ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">MOCKUPIDEA</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-0.5">Blog</h1>
                        </div>
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search articles..."
                                className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-600/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* ── Category nav tabs ── */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-5 mb-7 border-b border-gray-100 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest">
                        {CATEGORIES.map(cat => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategory(cat)}
                                    className={`transition-all duration-150 pb-0.5 border-b-2 ${isActive
                                        ? 'text-gray-900 border-gray-900'
                                        : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Content ── */}
                    {isLoading ? (
                        <>
                            <HeroSkeleton />
                            <GridSkeleton />
                        </>
                    ) : blogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                                    {debouncedSearch ? `No results for "${debouncedSearch}"` : 'No articles yet'}
                                </h3>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                    {debouncedSearch ? 'Try a different search term.' : 'Check back soon for design tips, tutorials and inspiration.'}
                                </p>
                            </div>
                            {(debouncedSearch || activeCategory !== 'All') && (
                                <button
                                    onClick={() => { setSearch(''); setDebouncedSearch(''); setActiveCategory('All'); setPage(1); }}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Featured hero (first article) */}
                            {heroBlog && page === 1 && !debouncedSearch && activeCategory === 'All' && (
                                <HeroCard blog={heroBlog} />
                            )}

                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {(page === 1 && !debouncedSearch && activeCategory === 'All' ? gridBlogs : blogs).map((blog: Blog) => (
                                    <FreepikCard key={blog.id} blog={blog} />
                                ))}
                            </div>

                            {/* ── Pagination: "← Previous page" | "Next page →" ── */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-12">
                                    {page > 1 && (
                                        <button
                                            onClick={() => { setPage(p => p - 1); scrollToTop(); }}
                                            className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:border-blue-400 hover:text-blue-600 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Previous page
                                        </button>
                                    )}
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                                        {page} / {totalPages}
                                    </span>
                                    {page < totalPages && (
                                        <button
                                            onClick={() => { setPage(p => p + 1); scrollToTop(); }}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20"
                                        >
                                            Next page
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
