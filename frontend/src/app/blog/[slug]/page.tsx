"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

const CATEGORY_COLORS: Record<string, string> = {
    Design: 'bg-blue-500', Mockups: 'bg-violet-500', Tutorials: 'bg-green-500',
    Inspiration: 'bg-orange-500', Resources: 'bg-pink-500', News: 'bg-red-500',
};

interface Blog {
    id: string; title: string; slug: string; content: string;
    excerpt?: string; coverImage?: string; category?: string;
    views: number; createdAt: string;
    author?: { id: number; name: string };
}

/* ── Skeleton ── */
function BlogSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="w-full aspect-[21/9] bg-gray-100 mb-0" />
            <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-10">
                <div className="h-4 w-20 bg-gray-200 rounded-full mb-6" />
                <div className="h-10 w-4/5 bg-gray-200 rounded-2xl mb-3" />
                <div className="h-8 w-2/3 bg-gray-200 rounded-2xl mb-7" />
                <div className="h-4 w-64 bg-gray-100 rounded-full mb-10" />
                {[100, 90, 80, 95, 70, 100, 85, 60, 90, 75].map((w, i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded-full mb-3" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        fetch(`${API_BASE_URL}/api/blogs/${slug}`, { headers })
            .then(r => r.json())
            .then(data => { if (data.status) setBlog(data.data); else setNotFound(true); })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const readTime = blog?.content ? Math.max(1, Math.ceil(blog.content.split(' ').length / 200)) : 0;
    const catColor = CATEGORY_COLORS[blog?.category || ''] || 'bg-blue-500';

    if (loading) {
        return (
            <div className="min-h-screen bg-white font-sans flex flex-col">
                <Header /><main className="flex-1"><BlogSkeleton /></main><Footer />
            </div>
        );
    }

    if (notFound || !blog) {
        return (
            <div className="min-h-screen bg-white font-sans flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-28 gap-6 text-center px-4">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Article Not Found</h1>
                        <p className="text-gray-500 max-w-sm mx-auto">This article may have been removed or the URL is incorrect.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/blog" className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">← All Articles</Link>
                        <Link href="/" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">Back to Home</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
            <Header />
            <main className="flex-1">

                {/* ── Full-width Cover Image ── */}
                {blog.coverImage && (
                    <div className="w-full aspect-[21/9] sm:aspect-[3/1] overflow-hidden bg-gray-100">
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <article className="max-w-[720px] mx-auto px-4 sm:px-8 pt-10 pb-20">

                    {/* ── Breadcrumb ── */}
                    <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-6">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
                        {blog.category && (<>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                            <span className="text-gray-700">{blog.category}</span>
                        </>)}
                    </nav>

                    {/* ── Category badge ── */}
                    {blog.category && (
                        <div className="mb-5">
                            <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded text-white ${catColor}`}>
                                {blog.category}
                            </span>
                        </div>
                    )}

                    {/* ── Title ── */}
                    <h1 className="text-3xl sm:text-[2.6rem] font-black leading-[1.12] tracking-tight text-gray-900 mb-4">
                        {blog.title}
                    </h1>

                    {/* ── Excerpt / hook ── */}
                    {blog.excerpt && (
                        <p className="text-[17px] text-gray-500 leading-relaxed font-medium mb-7 border-l-[3px] border-blue-500 pl-4">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* ── Author + meta row ── */}
                    <div className="flex flex-wrap items-center gap-3 pb-7 mb-8 border-b border-gray-100 text-sm text-gray-400">
                        {blog.author?.name && (
                            <div className="flex items-center gap-2 mr-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-sm ${catColor}`}>
                                    {blog.author.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700 font-semibold text-sm">{blog.author.name}</span>
                            </div>
                        )}
                        <span className="text-gray-200">·</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-gray-200">·</span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {readTime} min read
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {blog.views.toLocaleString()}
                        </span>
                    </div>

                    {/* ── Cover image inline (if no top banner) ── */}
                    {!blog.coverImage && (
                        <div className="mb-10 rounded-2xl overflow-hidden aspect-video bg-gray-100 shadow-xl shadow-gray-900/5">
                            <div className={`w-full h-full flex items-center justify-center ${catColor}`}>
                                <p className="text-white font-black text-xl text-center px-6 leading-tight">{blog.title}</p>
                            </div>
                        </div>
                    )}

                    {/* ── Markdown Body ── */}
                    <div className="prose prose-gray max-w-none mb-16
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
                        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:text-[16.5px]
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                        prose-strong:text-gray-900 prose-strong:font-black
                        prose-ul:text-gray-600 prose-ol:text-gray-600
                        prose-li:leading-7 prose-li:my-1
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/60 prose-blockquote:rounded-r-2xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-medium
                        prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[14px] prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#0f172a] prose-pre:rounded-2xl prose-pre:shadow-2xl
                        prose-hr:border-gray-100
                    ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
                    </div>

                    {/* ── Share row ── */}
                    <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-100">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-1">Share</span>
                        {[
                            { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, color: 'hover:bg-sky-500 hover:text-white hover:border-sky-500', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.844L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                            { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, color: 'hover:bg-blue-700 hover:text-white hover:border-blue-700', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                        ].map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold transition-all ${s.color}`}>
                                {s.icon}{s.label}
                            </a>
                        ))}
                        <button onClick={() => navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-all ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                            Copy Link
                        </button>
                    </div>

                    {/* ── Author card ── */}
                    {blog.author?.name && (
                        <div className="flex items-center gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-12">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0 ${catColor}`}>
                                {blog.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Written by</p>
                                <p className="text-base font-black text-gray-900">{blog.author.name}</p>
                                <p className="text-sm text-gray-400 mt-0.5">MOCKUPIDEA contributor</p>
                            </div>
                            <Link href="/blog" className="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline shrink-0">
                                More articles
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </Link>
                        </div>
                    )}

                    {/* ── CTA ── */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 sm:p-12 shadow-2xl">
                        <div className="absolute inset-0 opacity-[0.04]"
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                        <div className="relative z-10 text-center">
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-blue-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />Free Resources
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">Download Free Mockups</h2>
                            <p className="text-gray-400 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
                                Hundreds of high-quality, free mockup templates to make your designs shine.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/" className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/30">
                                    Browse Mockups
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                </Link>
                                <Link href="/blog" className="inline-flex items-center gap-2 px-7 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                                    More Articles
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
