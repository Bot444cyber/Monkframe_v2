"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CATEGORIES = [
    "License",
    "Restrictions",
    "Usage",
    "Other conditions"
];

export default function LicensesPage() {
    const scrollToCategory = (category: string) => {
        const element = document.getElementById(`license-category-${category.replace(/\s+/g, '-').toLowerCase()}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-6 max-w-5xl mx-auto w-full">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">License</h1>
                    <p className="text-gray-900 text-[15px] font-medium mb-6">
                        License for the use of mockups from the mockups-design.com website.
                    </p>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToCategory(cat)}
                                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors duration-200"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Box 1: License */}
                    <div id="license-category-license" className="bg-[#f8f9fa] p-8 md:p-10 rounded-xl scroll-mt-24 space-y-6">
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            <span className="font-bold">License Subject:</span> This license authorizes the use of mockups provided on the mockups-design.com website (hereinafter referred to as "Mockups") in accordance with the terms specified in this document.
                        </p>
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            <span className="font-bold">License Scope:</span> This license allows for the use of Mockups from the mockups-design.com website for any purpose, including commercial purposes. You may utilize Mockups in any medium, such as the internet, press, television, or portfolio. You may also use Mockups for your clients' needs without any limitations.
                        </p>
                    </div>

                    {/* Box 2: Restrictions */}
                    <div id="license-category-restrictions" className="bg-[#f8f9fa] p-8 md:p-10 rounded-xl scroll-mt-24 space-y-4">
                        <p className="text-gray-800 text-[14px] font-bold">Restrictions:</p>
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            a) You may not distribute Mockup files downloaded from the mockups-design.com website in an open format, such as PSD (Adobe Photoshop) or TIF (Tagged Image File Format). This applies to distribution on websites, file transfers through external services, email, FTP, etc.
                        </p>
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            b) Selling or distributing Mockups on stock and microstock websites is prohibited. This also applies to Mockups with the sample design disabled.
                        </p>
                    </div>

                    {/* Box 3: Usage */}
                    <div id="license-category-usage" className="bg-[#f8f9fa] p-8 md:p-10 rounded-xl scroll-mt-24 space-y-6">
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            <span className="font-bold">Usage of Mockups:</span> After modifying (replacing the sample design with your own) and saving the Mockup as a flattened graphic file, further distribution in this form is permitted. The prepared flattened file can be shared with clients, used in portfolios, television and press advertising, on websites and online stores, social media, and others.
                        </p>
                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            <span className="font-bold">No Source Attribution Requirement:</span> When using Mockups from mockups-design.com for commercial purposes, it is not necessary to include a link or any other information indicating the source of the Mockups.
                        </p>
                    </div>

                    {/* Box 4: Other conditions */}
                    <div id="license-category-other-conditions" className="bg-[#f8f9fa] p-8 md:p-10 rounded-xl scroll-mt-24 space-y-6">
                        <div>
                            <p className="text-gray-800 text-[14px] font-bold mb-4">Other Conditions:</p>
                            <p className="text-gray-800 text-[14px] leading-relaxed mb-4">
                                a) This license solely applies to Mockups downloaded from the mockups-design.com website and does not encompass other materials available on the website.
                            </p>
                            <p className="text-gray-800 text-[14px] leading-relaxed">
                                b) All Mockups provided on the mockups-design.com website are the property of mockups-design.com.
                            </p>
                        </div>

                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            <span className="font-bold">Liability:</span> I shall not be held liable for any damages, losses, or claims arising from the use of Mockups provided on the mockups-design.com website.
                        </p>

                        <p className="text-gray-800 text-[14px] leading-relaxed">
                            By accepting this license, you agree to the above terms and commit to adhering to them while using Mockups provided on the mockups-design.com website.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
