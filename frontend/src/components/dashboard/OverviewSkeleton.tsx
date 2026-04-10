import React from 'react';

export default function OverviewSkeleton() {
    return (
        <div className="space-y-8 pb-20 animate-pulse">
            {/* HERO METRICS SKELETON */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-card border border-border h-[140px] flex flex-col justify-between shadow-2xl">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-muted" />
                            <div className="w-16 h-6 rounded-full bg-muted/60" />
                        </div>
                        <div>
                            <div className="h-3 w-24 bg-muted mb-3 rounded" />
                            <div className="h-8 w-32 bg-muted/80 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ANALYTICS GRID SKELETON */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ECOSYSTEM GROWTH / TRADING TERMINAL */}
                <div className="lg:col-span-8 bg-card border border-border p-8 rounded-[2.5rem] flex flex-col min-h-[480px] shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="h-6 w-48 bg-muted mb-3 rounded" />
                            <div className="h-4 w-36 bg-muted/60 rounded" />
                        </div>
                        <div className="w-40 h-12 rounded-xl bg-muted/40" />
                    </div>

                    {/* Chart Skeleton (Curve) */}
                    <div className="flex-1 w-full flex items-end justify-center relative">
                        {/* Fake grid lines */}
                        <div className="absolute inset-x-0 bottom-0 top-0 border-b border-l border-muted/30">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full border-t border-muted/20 absolute" style={{ bottom: `${(i + 1) * 25}%` }} />
                            ))}
                        </div>
                        <div className="w-full h-48 bg-linear-to-t from-muted/50 to-transparent rounded-t-full mx-10 mt-20" />
                    </div>

                    <div className="mt-8 flex border-t border-border pt-6 gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-24 bg-muted rounded" />
                                <div className="h-4 w-12 bg-muted/80 rounded" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-24 bg-muted rounded" />
                                <div className="h-4 w-12 bg-muted/80 rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS SKELETON */}
                <div className="lg:col-span-4 space-y-8">
                    {/* TERMINAL SKELETON */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] flex flex-col h-[400px] shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="h-6 w-32 bg-muted rounded" />
                            <div className="w-3 h-3 rounded-full bg-muted" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/20 border border-border">
                                    <div className="min-w-[32px] h-8 rounded-lg bg-muted border border-border/50" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="flex justify-between">
                                            <div className="h-3 w-24 bg-muted rounded" />
                                            <div className="h-3 w-12 bg-muted/60 rounded" />
                                        </div>
                                        <div className="h-3 w-3/4 bg-muted/80 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PAYMENT HEALTH SKELETON */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl h-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="h-4 w-28 bg-muted rounded" />
                            <div className="h-6 w-16 bg-muted rounded-md" />
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full mb-8" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border">
                                <div className="h-3 w-16 bg-muted mb-3 mx-auto rounded" />
                                <div className="h-6 w-12 bg-muted/80 mx-auto rounded" />
                            </div>
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border">
                                <div className="h-3 w-16 bg-muted mb-3 mx-auto rounded" />
                                <div className="h-6 w-12 bg-muted/80 mx-auto rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP PERFORMERS SKELETON */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl mt-8">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-8 w-28 bg-muted/60 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 rounded-[2rem] bg-secondary/20 border border-border">
                            <div className="h-20 w-24 bg-muted border border-border rounded-2xl shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 w-full bg-muted rounded" />
                                <div className="flex gap-4">
                                    <div className="h-6 w-16 bg-muted/60 rounded-lg" />
                                    <div className="h-6 w-12 bg-muted/60 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
