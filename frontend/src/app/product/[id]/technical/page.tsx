"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import ProductIncludes from "@/components/product/ProductIncludes";
import Link from 'next/link';

export default function ProductTechnicalPage() {
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

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="h-10 w-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!product) return <div className="min-h-screen bg-white flex items-center justify-center">Product not found.</div>;

    const technicalMeta = [
        { label: "File Format", value: product.fileType || "Industry Standard" },
        { label: "Resolution", value: "High-DPI / Retinal Ready" },
        { label: "Software", value: "Figma, Sketch, Adobe XD" },
        { label: "Version", value: "v1.0.4 Premium" },
        { label: "License", value: "Full Commercial" }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-black selection:text-white">
            <Header />

            <main className="mx-auto max-w-[1400px] px-8 lg:px-16 py-24 lg:py-40">
                <div className="max-w-5xl">
                    <Link href={`/product/${product.id}`} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-12">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Project Overview
                    </Link>

                    <h1 className="text-6xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12">
                        Technical <br /> <span className="text-amber-500">Architecture.</span>
                    </h1>
                    <p className="text-2xl font-medium text-gray-400 leading-relaxed max-w-3xl mb-24">
                        A definitive guide to the requirements, structure, and technical foundation of the <span className="text-black">{product.title}</span> premium asset.
                    </p>
                </div>

                {/* Spec Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-gray-100 border border-gray-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200">
                    {technicalMeta.map((item, idx) => (
                        <div key={idx} className="bg-white p-12 flex flex-col gap-4 group hover:bg-gray-50 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">{item.label}</span>
                            <p className="text-xl font-black uppercase tracking-tight text-gray-900">{item.value}</p>
                        </div>
                    ))}
                    <div className="bg-black p-12 flex flex-col justify-between group">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Quick Start</span>
                        <Link href={`/product/${product.id}`} className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3 hover:gap-5 transition-all">
                            Order Now <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>

                {/* Full Breakdown */}
                <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-16">
                        <section className="flex flex-col gap-10">
                            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300">Detailed Specifications</h2>
                            <div className="p-12 rounded-[3.5rem] bg-secondary border border-border">
                                <ProductIncludes product={product} />
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-12 lg:sticky lg:top-40 h-fit">
                        <div className="p-12 rounded-[3rem] bg-white border border-gray-100 shadow-xl flex flex-col gap-10">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-lg font-black uppercase tracking-tight">Standard License</h3>
                                <div className="h-1 w-12 bg-amber-500 rounded-full" />
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">This professional resource comes with a universal commercial license, enabling use across unlimited personal and client projects.</p>
                            <ul className="flex flex-col gap-4">
                                {["No Attribution Required", "Lifetime Updates", "Priority Support", "High-Resolution Source"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-900">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
