import React from 'react';

export default function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            {/* ── Image Block Skeleton ── */}
            <div className="relative w-full aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden" />

            {/* ── Text Info Skeleton ── */}
            <div className="flex flex-col gap-2 px-0.5 mt-1">
                {/* Category */}
                <div className="h-3 bg-gray-200 rounded-full w-20" />

                {/* Title (2 lines) */}
                <div className="flex flex-col gap-1.5 mt-1">
                    <div className="h-4 bg-gray-300 rounded-full w-full" />
                    <div className="h-4 bg-gray-300 rounded-full w-5/6" />
                </div>

                {/* File meta */}
                <div className="h-3 bg-gray-200 rounded-full w-24 mt-2" />
            </div>
        </div>
    );
}
