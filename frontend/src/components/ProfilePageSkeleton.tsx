import React from 'react';

export default function ProfilePageSkeleton() {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:flex w-64 border-r border-gray-100 flex-col p-5 animate-pulse">
                <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex flex-col gap-2 flex-1 pt-1">
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-2 bg-gray-100/60 rounded w-2/3" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-50 rounded-xl" />
                    <div className="h-10 bg-gray-50 rounded-xl" />
                </div>
                <div className="mt-auto border-t border-gray-100 pt-6">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-3 bg-gray-100 rounded" />
                            <div className="h-2 bg-gray-100/60 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 p-6 lg:p-12 w-full max-w-[1600px] mx-auto animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div className="space-y-4 w-full">
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                        <div className="h-10 w-64 bg-gray-100 rounded" />
                        <div className="h-4 w-48 bg-gray-100 rounded" />
                    </div>
                    <div className="flex gap-3 shrink-0 auto-cols-auto">
                        <div className="h-16 w-24 bg-gray-50 border border-gray-100 rounded-xl" />
                        <div className="h-16 w-24 bg-gray-50 border border-gray-100 rounded-xl" />
                    </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
