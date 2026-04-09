export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-colors duration-500">
            <div className="flex flex-col items-center gap-4">
                {/* Simple MOCKUPIDEA Spinner */}
                <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading MOCKUPIDEA...</p>
            </div>
        </div>
    );
}