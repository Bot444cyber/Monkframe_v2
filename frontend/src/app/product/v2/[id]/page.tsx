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

export default function ProductArtifactPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [isWished, setIsWished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params?.id) return;
            try {
                const response = await InteractionService.getUI(params.id as string);
                if (response.status) {
                    const raw = response.data;
                    setProduct({
                        ...raw,
                        creatorName: raw.creator?.full_name || raw.author || "Unknown",
                    });
                    setIsWished(raw.wished || false);
                }
            } catch (error) { console.error(error); }
            finally { setIsLoading(false); }
        };
        fetchProduct();
    }, [params?.id]);

    const handleDownload = async () => {
        const token = localStorage.getItem('auth_token');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const toastId = toast.loading("Preparing artifact acquisition...");
        try {
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${API_BASE_URL}/api/uis/${product.id}/download`, { headers });
            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${product.title}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Artifact acquired!", { id: toastId });
        } catch (err) { toast.error("Acquisition failed", { id: toastId }); }
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!product) return <div className="min-h-screen bg-white flex items-center justify-center">Artifact not found.</div>;

    const screenshots = product.screenshots || (product.imageSrc ? [product.imageSrc] : []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
            <Header />

            <main className="mx-auto max-w-[1400px] px-8 py-20 lg:py-32 flex flex-col gap-32">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div className="w-full aspect-[4/5] bg-black rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(45,36,30,0.3)] border border-[#E8E1D9] group">
                        <img src={product.imageSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt={product.title} />
                    </div>

                    <div className="flex flex-col gap-10 lg:pt-8">
                        <div className="flex flex-col gap-4">
                            <span className="inline-flex px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full w-fit">Permanent Collection</span>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-none uppercase">
                                {product.title} <br /> <span className="text-blue-500/60">No. {product.id?.slice(-2) || "01"}</span>
                            </h1>
                        </div>

                        <p className="text-base font-medium text-[#8E8379] leading-relaxed max-w-xl italic">
                            {product.overview || "A masterful exploration of light and digital texture, hand-curated for the MOCKUPIDEA permanent collection."}
                        </p>

                        <div className="p-10 bg-white rounded-[2rem] shadow-xl shadow-blue-500/5 border border-blue-50 flex flex-col gap-8">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Acquisition Value</span>
                                <span className="text-4xl font-black text-blue-600">${product.price || "Free"}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleDownload} className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                                    Secure Acquisition <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </button>
                                <button className="w-full py-5 bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-blue-100 transition-all">
                                    Inquire with Curator
                                </button>
                            </div>
                            <div className="flex justify-center gap-8 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600">✔</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Certified Artifact</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600">✔</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Secured Asset</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-8 bg-blue-50/50 rounded-2xl flex flex-col gap-2 border border-blue-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">Dimensions</span>
                                <span className="text-sm font-black text-gray-900 uppercase">1280 x 1280 px</span>
                            </div>
                            <div className="p-8 bg-blue-50/50 rounded-2xl flex flex-col gap-2 border border-blue-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">Medium</span>
                                <span className="text-sm font-black text-gray-900 uppercase">Digital Masterpiece</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Observation Gallery */}
                <section className="flex flex-col gap-12">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">The Detail View</span>
                            <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900">Observation Gallery</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {screenshots.slice(1, 4).map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-[#E8E1D9] group shadow-lg hover:shadow-2xl transition-all">
                                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Provenance Card */}
                <section className="p-16 lg:p-24 bg-blue-50/20 rounded-[4rem] border border-blue-100 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-blue-600 rounded-full -mt-0.5" />
                    <h2 className="text-4xl font-black text-center uppercase tracking-tight text-gray-900 mb-20">Artifact Provenance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
                        {[
                            { label: "Creation", value: "MOCKUPIDEA Studio // Autumn 2025 Permanent Collection." },
                            { label: "Authentication", value: "Verified digital signature. Inclusion in the immutable MOCKUPIDEA archive." },
                            { label: "Exhibition", value: "Featured Showcase: Premium Design Infrastructure." },
                            { label: "Requirements", value: "Optimized for High-DPI professional workflows." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 leading-none">{item.label}</span>
                                <p className="text-xs font-bold leading-relaxed text-gray-600">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 pt-16 border-t border-gray-100">
                        <ProductIncludes product={product} />
                    </div>
                </section>
            </main>

            <Footer />
            <style jsx>{` .serif-font-standard { font-family: 'Times New Roman', Times, serif; } `}</style>
        </div>
    );
}
