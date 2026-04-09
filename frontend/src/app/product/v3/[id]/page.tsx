"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import ProductIncludes from "@/components/product/ProductIncludes";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';

export default function ProductCinematicPage() {
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

    const handleDownload = async () => {
        const token = localStorage.getItem('auth_token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const toastId = toast.loading("Downloading...");
        try {
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${API_BASE_URL}/api/uis/${product.id}/download`, { headers });
            if (!response.ok) throw new Error();
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${product.title}.zip`;
            document.body.appendChild(a);
            a.click();
            toast.success("Downloaded!", { id: toastId });
        } catch (err) { toast.error("Error", { id: toastId }); }
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!product) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">Product not found.</div>;

    const screenshots = product.screenshots || (product.imageSrc ? [product.imageSrc] : []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-500/30">
            <Header />

            <main className="pt-32 lg:pt-48 pb-32">
                {/* Immersive Hero */}
                <div className="mx-auto max-w-[1600px] px-8 flex flex-col gap-12 mb-40">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                        <h1 className="text-6xl lg:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] mix-blend-difference text-blue-600">
                            {product.title} <br /> <span className="text-blue-500">Vol. III</span>
                        </h1>
                        <div className="flex flex-col gap-6 items-end text-right">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Visual Spec v3.0 Premium</span>
                            <button onClick={handleDownload} className="px-12 py-5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-black hover:text-white transition-all shadow-2xl shadow-blue-500/20">
                                Get Cinematic Pack
                            </button>
                        </div>
                    </div>
                </div>

                {/* Massive Mosaic Gallery */}
                <div className="w-full flex flex-col gap-2">
                    <div className="h-[70vh] w-full overflow-hidden relative group border-y border-gray-100">
                        <img src={screenshots[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent flex items-end p-12 lg:p-24">
                            <p className="text-lg lg:text-3xl font-black uppercase tracking-tighter max-w-2xl leading-tight text-gray-900">
                                {product.overview || "Engineered for high-impact visual storytelling. Redefining the boundaries of premium design assets."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {screenshots.slice(1, 3).map((img: string | Blob | undefined, i: React.Key | null | undefined) => (
                            <div key={i} className="h-[50vh] overflow-hidden border border-gray-100 bg-blue-50/10 group">
                                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Minimal Technical Section */}
                <div className="mx-auto max-w-[1400px] px-8 pt-40 flex flex-col gap-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-12">
                            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-12">Architecture & Specs</h2>
                            <div className="p-2 border-t border-gray-100 pt-16">
                                <ProductIncludes product={product} />
                            </div>
                        </div>
                        <div className="lg:col-span-4 flex flex-col gap-12 hidden">
                            <div className="p-12 rounded-[3.5rem] border border-gray-100 bg-blue-50/20 backdrop-blur-3xl flex flex-col gap-8 text-center items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Final Decision</span>
                                <h3 className="text-3xl font-black text-gray-900 uppercase">Ready?</h3>
                                <button onClick={handleDownload} className="w-full py-6 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-blue-700 hover:text-white transition-all shadow-blue-500/10">
                                    Download Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Version Selector */}
                <div className="mt-64 flex justify-center gap-12 items-center opacity-70 hover:opacity-100 transition-opacity">
                    <Link href={`/product/v1/${product.id}`} className="text-[10px] font-black uppercase tracking-[0.5em] hover:text-blue-600 transition-all text-gray-400">v1. Standard</Link>
                    <div className="h-1 w-1 bg-gray-200 rounded-full" />
                    <Link href={`/product/v2/${product.id}`} className="text-[10px] font-black uppercase tracking-[0.5em] hover:text-blue-600 transition-all text-gray-400">v2. Curator</Link>
                    <div className="h-1 w-1 bg-gray-200 rounded-full" />
                    <Link href={`/product/v3/${product.id}`} className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 transition-all">v3. Panoramic</Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
