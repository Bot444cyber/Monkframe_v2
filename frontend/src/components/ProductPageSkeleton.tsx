import React from 'react';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ProductPageSkeleton() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
            <Header />

            <main className="flex-1 relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-16">
                {/* 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 relative items-start">

                    {/* Left Column - Image Skeletons */}
                    <div className="w-full lg:w-[62%] flex flex-col gap-12">
                        <div className="w-full bg-gray-100 rounded-[2.5rem] animate-pulse" style={{ aspectRatio: '16 / 10' }} />
                        <div className="w-full bg-gray-100 rounded-[2.5rem] animate-pulse" style={{ aspectRatio: '16 / 10' }} />
                    </div>

                    {/* Right Column - Meta Data Skeletons */}
                    <div className="w-full lg:w-[38%] flex flex-col gap-10 lg:gap-12 mt-4 lg:mt-0">

                        {/* Title & Category Box */}
                        <div className="flex flex-col gap-4">
                            <div className="w-24 h-4 bg-gray-100 rounded-full mb-2 animate-pulse" />
                            <div className="w-full h-8 bg-gray-200 rounded animate-pulse mb-1" />
                            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-4" />

                            <div className="w-full h-4 bg-gray-100 rounded animate-pulse mt-4" />
                            <div className="w-full h-4 bg-gray-100 rounded animate-pulse mt-1" />
                            <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse mt-1" />
                        </div>

                        {/* Author Section */}
                        <div className="flex items-center gap-4 py-6 border-y border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse shrink-0" />
                            <div className="flex flex-col gap-2">
                                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Download Box */}
                        <div className="w-full bg-gray-50 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-6">
                            <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                            <div className="w-5/6 h-4 bg-gray-100 rounded animate-pulse" />
                            <div className="w-full h-14 bg-gray-200 rounded-2xl mt-4 animate-pulse" />
                        </div>

                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
