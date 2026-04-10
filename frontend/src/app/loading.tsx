export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-colors duration-500">
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-2xl">
                    <img src="/logo/M_SHAPE.svg" alt="MOCKUPIDEA" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading MOCKUPIDEA...</p>
            </div>
        </div>
    );
}