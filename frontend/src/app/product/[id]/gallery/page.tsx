"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import Link from 'next/link';

export default function ProductGalleryPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params?.id) return;
            try {
                const response = await InteractionService.getUI(params.id as string);
                if (response.status) setProduct(response.data);
            } catch (error) { console.error(error); }
            finally { setIsLoading(false); }
        };
        fetchProduct();
    }, [params?.id]);

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="h-12 w-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Asset not found.</div>;

    const galleryImages = product.screenshots || (product.imageSrc ? [product.imageSrc] : []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-amber-400/30">
            <Header />

            <main className="mx-auto max-w-[1800px] px-6 lg:px-12 py-24 lg:py-32">
                {/* Immersive Header */}
                <div className="flex flex-col gap-8 mb-24">
                    <Link href={`/product/${product.id}`} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 hover:text-gray-900 transition-all">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Back to Identity
                    </Link>
                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-gray-900">
                        The <span className="text-amber-500">Visual</span> <br /> Experience.
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-amber-500/30 to-transparent mt-4" />
                </div>

                {/* Premium Bento-Inspired Gallery Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Featured Large View */}
                    <div className="md:col-span-8 flex flex-col gap-12">
                        {galleryImages.slice(0, 3).map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-video rounded-[3rem] overflow-hidden border border-gray-100 bg-gray-50 group shadow-2xl shadow-gray-200/50">
                                <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Shot 0{idx + 1} // Detail View</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Side Grid Scroll */}
                    <div className="md:col-span-4 lg:sticky lg:top-32 flex flex-col gap-8">
                        <div className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100 flex flex-col gap-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Gallery Context</h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                This immersive showcase explores the core design language of <span className="text-gray-900">{product.title}</span>. Every pixel is crafted for high-class impact.
                            </p>
                            <div className="flex flex-col gap-4">
                                <Link href={`/product/${product.id}`} className="w-full py-5 bg-amber-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-600 transition-all text-center shadow-xl shadow-amber-500/20">
                                    Acquire Full Kit
                                </Link>
                                <button className="w-full py-5 bg-transparent border border-gray-200 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all">
                                    Request Customization
                                </button>
                            </div>
                        </div>

                        {/* Smaller secondary grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {galleryImages.slice(3).map((img: string, idx: number) => (
                                <div key={idx} className="aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 hover:border-amber-500/50 transition-all cursor-zoom-in shadow-sm">
                                    <img src={img} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Horizontal Marquee or Final Link */}
                <div className="mt-40 border-t border-gray-100 pt-20 flex flex-col items-center gap-12">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300">End of Session</h4>
                    <Link href={`/product/${product.id}`} className="text-3xl lg:text-5xl font-black text-gray-900 hover:text-amber-500 transition-colors uppercase tracking-tight">
                        Return to <span className="underline decoration-amber-500/50 underline-offset-8">Product Hub</span>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
