"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

// ─── Mega-menu cache (module-level — persists across hovers/navigations) ──────
const _megaCache = new Map<string, any[]>();
const _megaPromises = new Map<string, Promise<any[]>>();

export default function DynamicMegaMenu({ category, onClose }: { category: string; onClose: () => void }) {
    // Seed from cache immediately so we never show a skeleton for cached categories
    const [items, setItems] = useState<any[]>(() => _megaCache.get(category) ?? []);
    const [loading, setLoading] = useState(() => !_megaCache.has(category));

    useEffect(() => {
        // Already cached → nothing to do
        if (_megaCache.has(category)) {
            setItems(_megaCache.get(category)!);
            setLoading(false);
            return;
        }

        let active = true;

        // Fetch in progress by another instance → attach to that promise
        if (_megaPromises.has(category)) {
            _megaPromises.get(category)!.then(data => {
                if (active) { setItems(data); setLoading(false); }
            });
            return () => { active = false; };
        }

        // First fetch for this category
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const fetchPromise = fetch(`${apiUrl}/api/uis?category=${encodeURIComponent(category)}&limit=7`)
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    const mapped = data.data.map((ui: any) => {
                        const rawDesc = ui.overview || 'High-fidelity mockups for your next big project.';
                        let plainDesc = rawDesc.replace(/[*_~`#><=[[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
                        if (plainDesc.length > 95) plainDesc = plainDesc.substring(0, 95) + '...';
                        const rawTitle = ui.title || 'Untitled';
                        const shortTitle = rawTitle.length > 45 ? rawTitle.substring(0, 45) + '...' : rawTitle;
                        return { id: ui.id, title: shortTitle, imageSrc: ui.imageSrc, description: plainDesc };
                    });
                    _megaCache.set(category, mapped);
                    return mapped;
                }
                return [];
            })
            .catch(err => {
                console.error("Failed to fetch mega menu data:", err);
                return [];
            });

        _megaPromises.set(category, fetchPromise);

        fetchPromise.then(data => {
            if (active) { setItems(data); setLoading(false); }
        });

        return () => { active = false; };
    }, [category]);

    const trendingItem = items[0];
    const otherItems = items.slice(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1, ease: 'linear' }}
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
                            <Image
                                src={trendingItem.imageSrc}
                                alt={trendingItem.title}
                                fill
                                className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        <div className="p-6 relative z-10 flex flex-col h-full bg-linear-to-t from-blue-900/80 to-transparent">
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
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Latest Uploads</p>
                        </div>
                        {otherItems.length > 0 ? (
                            otherItems.map((item, ii) => (
                                <div key={ii} className="flex flex-col gap-1">
                                    <Link href={`/product/v1/${item.id}`} onClick={onClose} className="group block">
                                        <h4 className="text-[13px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">{item.title}</h4>
                                        <p className="text-[11px] text-gray-600 truncate mt-0.5">View details</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-[12px] font-bold text-gray-600">More coming soon</p>
                                <p className="text-[11px] text-gray-600 mt-1">We're adding new mockups.</p>
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
}
