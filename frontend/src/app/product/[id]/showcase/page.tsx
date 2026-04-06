"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import Link from 'next/link';

export default function ProductShowcasePage() {
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
    if (!product) return <div className="min-h-screen bg-white flex items-center justify-center">Asset not found.</div>;

    const screenshots = product.screenshots || (product.imageSrc ? [product.imageSrc] : []);

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-amber-400/30">
            <Header />

            <main className="w-full pt-20">
                {/* Back Link */}
                <div className="mx-auto max-w-[1400px] px-8 mb-12">
                    <Link href={`/product/${product.id}`} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-amber-500 transition-colors">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Project Hub
                    </Link>
                </div>

                {/* Hero Storytelling Section */}
                <section className="mx-auto max-w-[1400px] px-8 flex flex-col gap-10 mb-40">
                    <h1 className="text-6xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-gray-900">
                        Design <br /> <span className="text-amber-500">Mastery.</span>
                    </h1>
                    <div className="flex flex-col lg:flex-row gap-20 items-end">
                        <div className="w-full lg:w-1/2 aspect-square rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                            <img src={product.imageSrc} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-10 pb-12">
                            <h2 className="text-4xl font-black uppercase tracking-tight leading-none text-gray-900">{product.title}</h2>
                            <p className="text-xl text-gray-400 leading-relaxed font-medium italic border-l-4 border-amber-500/20 pl-8">
                                "{product.overview || product.description || "Crafted for the modern design professional, this kit embodies excellence in every detail."}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* Alternating Feature Showcase */}
                {screenshots.map((img: string, idx: number) => (
                    <section key={idx} className={`w-full py-32 ${idx % 2 === 0 ? 'bg-white' : 'bg-secondary'} border-y border-gray-100`}>
                        <div className={`mx-auto max-w-[1400px] px-8 flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}>
                            <div className="w-full lg:w-3/5 rounded-[3rem] overflow-hidden shadow-2xl group border border-border bg-background">
                                <img src={img} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000" />
                            </div>
                            <div className="w-full lg:w-2/5 flex flex-col gap-8">
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Perspective 0{idx + 1}</span>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-gray-900 leading-tight">
                                    {idx === 0 ? "Precision Engineering" : idx === 1 ? "Seamless Harmony" : "Infinite Scalability"}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Every component is built on a strict grid system, ensuring that your final designs look consistent and professional across all device formats.
                                </p>
                                <div className="h-px w-20 bg-amber-500/30" />
                            </div>
                        </div>
                    </section>
                ))}

                {/* Acquisition Closure */}
                <section className="py-40 flex flex-col items-center gap-12 text-center bg-white">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300">Ready to Elevate?</h4>
                    <Link href={`/product/${product.id}`} className="text-4xl lg:text-7xl font-black text-gray-900 hover:text-amber-500 transition-all uppercase tracking-tighter">
                        Download Now
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
