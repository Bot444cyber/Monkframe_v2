"use client";

import Link from "next/link";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

import PaymentModal from "../payment/PaymentModal";

interface ProductHeaderProps {
    id: string;
    title: string;
    subtitle: string;
    author: string;
    price: string;
    isLiked?: boolean;
    isWished?: boolean;
    likesCount?: number;
    commentsCount?: number;
    fileType?: string;
    previewUrl?: string;
    onToggleLike?: (e: React.MouseEvent) => void;
    onToggleWishlist?: (e: React.MouseEvent) => void;
}

export default function ProductHeader({
    id,
    title,
    subtitle,
    author,
    price,
    isLiked = false,
    isWished = false,
    likesCount = 0,
    commentsCount = 0,
    fileType,
    previewUrl,
    onToggleLike,
    onToggleWishlist
}: ProductHeaderProps) {
    const { user } = useAuth();
    const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);

    // File Type Icon Helper
    const getFileIcon = (type: string | undefined) => {
        if (!type) return null;
        const lower = type.toLowerCase();
        if (lower.includes('figma')) return <svg className="w-3.5 h-3.5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38L19 38V28.5Z" fill="#1ABCFE" /><path d="M9.5 38C6.98043 38 4.56408 36.9991 2.78249 35.2175C1.00089 33.4359 0 31.0196 0 28.5C0 25.9804 1.00089 23.5641 2.78249 21.7825C4.56408 20.0009 6.98043 19 9.5 19L19 19V38H9.5Z" fill="#A259FF" /><path d="M19 19V9.5C19 6.98043 17.9991 4.56408 16.2175 2.78249C14.4359 1.00089 12.0196 0 9.5 0C6.98043 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98043 0 9.5L0 19L19 19Z" fill="#F24E1E" /><path d="M9.5 38C6.34963 37.999 3.32846 39.2498 1.10086 41.4774C-1.12674 43.705 -1.12674 47.317 1.10086 49.5446C3.32846 51.7722 6.34963 53.023 9.5 53.022C12.0196 53.022 14.4359 52.0211 16.2175 50.2395C17.9991 48.4579 19 46.0416 19 43.522L19 38L9.5 38Z" fill="#0ACF83" /><path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98043 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0L19 0Z" fill="#FF7262" /></svg>;
        if (lower.includes('sketch')) return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.7758 5.76019L11.9961 0.490234L21.2163 5.76019L21.2163 18.2392L11.9961 23.5113L2.7758 18.2392V5.76019Z" fill="#FDB300" /><path d="M11.9961 0.490234L11.9961 23.5113L21.2163 18.2392V5.76019L11.9961 0.490234Z" fill="#EA6C00" /></svg>;
        // React
        if (lower.includes('react')) return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M12 2C16.5 2 20 6.5 20 12C20 17.5 16.5 22 12 22C7.5 22 4 17.5 4 12C4 6.5 7.5 2 12 2Z" /><path d="M12 2C7.5 2 3 6.5 3 12C3 17.5 7.5 22 12 22C16.5 22 21 17.5 21 12C21 6.5 16.5 2 12 2Z" transform="rotate(60 12 12)" /><path d="M12 2C7.5 2 3 6.5 3 12C3 17.5 7.5 22 12 22C16.5 22 21 17.5 21 12C21 6.5 16.5 2 12 2Z" transform="rotate(-60 12 12)" /></svg>;
        // Default
        return (
            <div className="w-3.5 h-3.5 rounded-[3px] bg-zinc-600 flex items-center justify-center text-[7px] font-bold text-white uppercase">
                {type.slice(0, 1)}
            </div>
        );
    };

    // Determine if product is free
    const isFree = !price || price === 'Free' || price === '$0' || price === '0';

    const handleLikeClick = (e: React.MouseEvent) => {
        if (!user) {
            toast.error("Please login to like this asset");
            return;
        }
        if (onToggleLike) onToggleLike(e);
    };

    return (
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {title}
                </h1>

                {/* Highlights / Categories Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Badge - Solid Color */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-700/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-zinc-400">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                        </svg>
                        {subtitle}
                    </div>

                    {/* Verified High Quality Badge - Solid Color */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-emerald-400 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        Verified Quality
                    </div>

                    {/* File Type Badge - Brand Icon */}
                    {fileType && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm font-medium">
                            {getFileIcon(fileType)}
                            <span className="">{fileType}</span>
                        </div>
                    )}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 text-sm mt-1">
                    <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-yellow-400 ring-2 ring-black flex items-center justify-center text-xs font-bold text-amber-900 shadow-lg">
                            {author.charAt(0)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Created by</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-semibold hover:text-indigo-400 transition-colors cursor-pointer">{author}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600"></span>
                            <span className="text-zinc-500">Updated recently</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* Like Button */}
                <button
                    onClick={handleLikeClick}
                    className={`flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${isLiked
                        ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {likesCount}
                </button>

                {/* Comment Button */}
                <button className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {commentsCount}
                </button>

                {/* Action Buttons */}
                {previewUrl && (
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 hidden sm:flex items-center gap-2 group"
                    >
                        <span>Preview</span>
                        <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => onToggleWishlist && onToggleWishlist(e)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${isWished
                        ? "bg-pink-500 border-pink-400 text-white shadow-lg shadow-pink-500/20"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isWished ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

                {isFree ? (
                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/api/uis/${id}/download`}
                        className="h-10 rounded-full bg-white text-black px-6 text-sm font-bold flex items-center gap-2 transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m3 3l3-3m-3 3V3" />
                        </svg>
                        Download Now
                    </a>
                ) : (
                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error("Please login to purchase this asset");
                                return;
                            }
                            setIsPaymentOpen(true);
                        }}
                        className="h-10 rounded-full bg-white text-black px-6 text-sm font-bold flex items-center gap-2 transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Purchase for {price}
                    </button>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                product={{
                    title: title,
                    price: price,
                    imageSrc: undefined // Image not available in header props
                }}
                onSuccess={() => {
                    toast.success("Payment successful! Downloading...");
                    // Trigger download after payment
                    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/api/uis/${id}/download`;
                }}
            />
        </div>
    );
}
