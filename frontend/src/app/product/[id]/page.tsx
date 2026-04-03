"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import CommentSection from "@/components/CommentSection";
import ProductIncludes from "@/components/product/ProductIncludes";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isWished, setIsWished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const downloadTriggered = React.useRef(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params?.id) return;
            try {
                const response = await InteractionService.getUI(params.id as string);
                if (response.status) {
                    const raw = response.data;
                    const normalized = {
                        ...raw,
                        price: !raw.price || raw.price == 0 ? 'Free' : `$${raw.price}`,
                        author: raw.creator?.full_name || raw.author || "Unknown",
                    };
                    setProduct(normalized);
                    setLikesCount(raw.likes || 0);
                    setIsLiked(raw.liked || false);
                    setIsWished(raw.wished || false);
                    if (raw.commentsCount !== undefined) setCommentsCount(raw.commentsCount);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [params?.id]);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !isLiked;
        setIsLiked(newState);
        setLikesCount(prev => newState ? prev + 1 : prev - 1);

        try {
            const response = await InteractionService.toggleLike(product.id);
            if (response.likesCount !== undefined) setLikesCount(response.likesCount);
            if (response.liked !== undefined) {
                setIsLiked(response.liked);
                if (response.liked) toast.success(response.message || "Liked!");
                else toast.success(response.message || "Unliked");
            }
        } catch (error) {
            setIsLiked(!newState);
            setLikesCount(prev => !newState ? prev + 1 : prev - 1);
            toast.error("Failed to like");
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !isWished;
        setIsWished(newState);

        try {
            const response = await InteractionService.toggleWishlist(product.id);
            if (response.wished !== undefined) {
                setIsWished(response.wished);
                if (response.wished) toast.success("Added to wishlist");
                else toast.success("Removed from wishlist");
            }
        } catch (error) {
            setIsWished(!newState);
            toast.error("Failed to update wishlist");
        }
    };

    const handleDownload = async () => {
        const token = localStorage.getItem('auth_token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const toastId = toast.loading("Preparing secure download...");

        try {
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/uis/${product.id}/download`, {
                headers: headers
            });

            if (!response.ok) {
                let errorMsg = "Failed to initiate download.";
                try {
                    const errorData = await response.json();
                    if (errorData.message) errorMsg = errorData.message;
                } catch (e) { }
                toast.error(errorMsg, { id: toastId });
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${product.title || 'asset'}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Download started!", { id: toastId });
        } catch (err) {
            toast.error("Network error while trying to download.", { id: toastId });
        }
    };

    useEffect(() => {
        if (product && product.purchased) {
            const hasAutoDownload = new URLSearchParams(window.location.search).get('autoDownload') === 'true';
            if (hasAutoDownload && !downloadTriggered.current) {
                downloadTriggered.current = true;
                handleDownload();

                // Clear out the query parameters safely without refreshing
                const url = new URL(window.location.href);
                url.searchParams.delete('autoDownload');
                window.history.replaceState({}, '', url);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.purchased]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 animate-pulse">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <p className="text-xl text-gray-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-600/30">
            <Header />

            <main className="relative mx-auto max-w-[1400px] px-6 lg:px-16 py-12 lg:py-16">

                {/* 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">

                    {/* Left Column - Images and Discussion */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-12 order-1 lg:order-1">
                        {/* Huge Vertical Stack */}
                        <ProductGallery product={product} />

                    </div>

                    {/* Right Column - Sticky Meta Data */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-4 order-2 lg:order-2">
                        <div className="lg:sticky lg:top-32 flex flex-col gap-10 lg:gap-12">
                            <ProductInfo product={product} />

                            {/* Restricted Box acting as purchase boundary */}
                            <div className="w-full bg-[#f8f9fa] border border-gray-100 p-6 flex flex-col items-center justify-center text-center gap-6">
                                <div className="max-w-md">
                                    <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
                                        Try Pro Membership for UI Free. Only pro user download this UI and use this in any client or personal project.
                                    </p>
                                    <div className="flex flex-col gap-3 w-full">
                                        <button onClick={handleDownload} className="w-full py-4 px-6 bg-blue-600 border border-transparent text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 rounded-xl">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download Asset
                                        </button>
                                        <button className="w-full py-3.5 px-6 bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm rounded-xl">
                                            Join Pro
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ProductIncludes product={product} />
                        </div>
                    </div>

                </div>

                {/* Full Width Discussion Area */}
                <div className="w-full max-w-6xl mx-auto mt-24 pt-16 border-t border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-4">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Discussion ({commentsCount})</h3>
                        <div className="flex items-center gap-5">
                            <button
                                onClick={handleToggleLike}
                                className={`flex items-center gap-2 text-[15px] font-bold transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {likesCount}
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`flex items-center gap-2 text-[15px] font-bold transition-colors ${isWished ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <svg className={`w-5 h-5 ${isWished ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Save
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-3xl pb-8">
                        <CommentSection
                            uiId={product.id}
                            variant="embedded"
                            onCommentsChange={setCommentsCount}
                        />
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
