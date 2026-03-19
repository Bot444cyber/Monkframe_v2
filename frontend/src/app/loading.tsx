export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
                {/* Simple Monkframe Spinner */}
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading Monkframe...</p>
            </div>
        </div>
    );
}