"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/page/home/Faq';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-8 pb-16 px-6">
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
