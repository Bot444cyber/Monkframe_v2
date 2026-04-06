"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import Link from 'next/link';

export default function ProductFeaturesPage() {
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

    if (isLoading) return <div className="min-h-screen bg-[#080808] flex items-center justify-center"><div className="h-12 w-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!product) return <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">Asset not found.</div>;

    const highlights = product.highlights || ["Premium Quality", "Fully Componentized", "Grid System Included", "Responsive Ready"];

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-amber-500/30">
            <Header />

            <main className="mx-auto max-w-[1400px] px-8 py-32 lg:py-48">
                {/* Aesthetic Branding Header */}
                <div className="flex flex-col gap-10 mb-32">
                    <Link href={`/product/${product.id}`} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-amber-500 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Back to Core
                    </Link>
                    <h1 className="text-7xl lg:text-[12rem] font-black tracking-tighter uppercase leading-[0.8] text-gray-900">
                        Core <br /> <span className="text-amber-500">Value.</span>
                    </h1>
                </div>

                {/* Feature Card Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-200/50">
                    {highlights.map((feature: string, idx: number) => (
                        <div key={idx} className="p-16 lg:p-24 bg-white flex flex-col gap-10 group hover:bg-gray-50 transition-colors duration-500">
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Capability 0{idx + 1}</span>
                            <div className="flex flex-col gap-6">
                                <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-gray-900">{feature}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    Our commitment to professional excellence means every feature is tested and refined to meet the highest industry standards. Experience unparalleled quality and attention to detail in every layer.
                                </p>
                            </div>
                            <div className="h-1 w-20 bg-amber-500" />
                        </div>
                    ))}
                    <div className="p-16 lg:p-24 bg-amber-500 flex flex-col justify-between group cursor-pointer hover:bg-amber-600 transition-all duration-500">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Final Action</span>
                        <Link href={`/product/${product.id}`} className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-white transition-colors flex items-center gap-6">
                            Acquire Now <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>

                <div className="mt-40 flex justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">Monkframe Quality Standard 2026</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
