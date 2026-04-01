export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-colors duration-500">
            <div className="flex flex-col items-center gap-4">
                {/* Simple Monkframe Spinner */}
                <div className="w-12 h-12 border-4 border-border border-t-foreground rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest animate-pulse">Loading Monkframe...</p>
            </div>
        </div>
    );
}