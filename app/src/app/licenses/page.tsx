"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LicensesPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-32 pb-16 px-6">
                <div className="max-w-[1000px] mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">License Agreement</h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            Clear, simple terms for using our assets in your personal and commercial projects.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        {/* Standard License */}
                        <div className="max-w-lg w-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white hover:border-white transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-white mb-6 group-hover:bg-zinc-200 group-hover:scale-110 group-hover:text-black transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-black">Individual License</h3>
                            <p className="text-zinc-400 text-sm mb-8 leading-relaxed group-hover:text-zinc-600">
                                Perfect for freelancers and individuals. Use in unlimited personal and commercial projects.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Unlimited personal projects",
                                    "Unlimited commercial projects",
                                    "Modify and combine assets",
                                    "No attribution required"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 group-hover:text-zinc-800">
                                        <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
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
