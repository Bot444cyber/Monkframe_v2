import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Sidebar Skeleton (Hidden on Mobile) */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-2xl flex-col">
                <div className="h-24 flex items-center px-8 border-b border-border/50 bg-secondary/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted shrink-0 animate-pulse" />
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                            <div className="h-2 w-16 bg-muted/60 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="h-2 w-16 bg-muted mb-6 ml-4 animate-pulse" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/20">
                            <div className="w-5 h-5 bg-muted rounded-md animate-pulse" />
                            <div className="h-3 w-24 bg-muted/80 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
                {/* Header Skeleton */}
                <header className="h-20 lg:h-24 border-b border-border bg-card/50 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
                    <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="hidden sm:block w-8 h-8 rounded-full bg-muted animate-pulse" />
                    </div>
                </header>

                {/* Body Content Skeleton */}
                <div className="flex-1 p-6 lg:p-12 space-y-10">
                    <div className="flex flex-col gap-3">
                        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-96 bg-muted/60 rounded animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-card border border-border p-6 rounded-[2rem] h-36 flex flex-col justify-between">
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="h-8 w-32 bg-muted/80 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] h-[500px] p-8 mt-10">
                        <div className="h-6 w-48 bg-muted mb-8 rounded animate-pulse" />
                        <div className="w-full h-full border-t border-border mt-8 flex flex-col gap-6 pt-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-muted shrink-0 animate-pulse" />
                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
