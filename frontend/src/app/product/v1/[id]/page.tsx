"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
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
                        creatorName: raw.creator?.full_name || raw.author || "Unknown",
                        additionalInfo: raw.author || "",
                    };
                    setProduct(normalized);
                    setIsWished(raw.wished || false);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [params?.id]);


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
        return <ProductPageSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <p className="text-xl text-gray-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-500/30">
            <Header />

            <main className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-16">

                {/* 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 relative items-start">

                    {/* Left Column - Images (Sticky capability) */}
                    <div className="w-full lg:w-[62%] flex flex-col gap-12 lg:sticky lg:top-32 h-fit">
                        {/* Huge Vertical Stack */}
                        <ProductGallery product={product} />

                    </div>

                    {/* Right Column - Meta Data (Sticky) */}
                    <div className="w-full lg:w-[38%] flex flex-col pt-0 lg:pt-4 lg:sticky lg:top-32 h-fit">
                        <div className="flex flex-col gap-10 lg:gap-12">

                            <ProductInfo
                                product={product}
                                isWished={isWished}
                                onToggleWishlist={handleToggleWishlist}
                            />

                            {/* Free Download Box */}
                            <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                                <div className="max-w-md">
                                    <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
                                        This premium UI asset is available for free. Download and use it in your personal or commercial projects.
                                    </p>
                                    <div className="flex flex-col gap-3 w-full">
                                        <button onClick={handleDownload} className="w-full py-4.5 px-8 bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.1em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 rounded-2xl">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Free Download
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ProductIncludes product={product} />
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
