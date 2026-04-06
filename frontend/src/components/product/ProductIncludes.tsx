import React, { useState } from 'react';

interface ProductIncludesProps {
    product?: any;
}

export default function ProductIncludes({ product }: ProductIncludesProps) {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitting(true);
            setErrorMsg('');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/newsletter/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (response.ok && data.status) {
                    setSubscribed(true);
                    setEmail('');
                } else {
                    setErrorMsg(data.message || "Failed to subscribe. Please try again.");
                }
            } catch (err) {
                console.error("Subscription error", err);
                setErrorMsg("Network error. Please try again later.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    let specs: string[] = [];
    try {
        if (Array.isArray(product?.specifications)) {
            specs = product.specifications;
        } else if (typeof product?.specifications === 'string') {
            specs = JSON.parse(product.specifications);
        }
    } catch { }

    const fileFormat = product?.fileType;
    const fileSize = product?.fileSize;

    if (!specs || specs.length === 0) {
        if (fileFormat && fileFormat !== "---" && fileFormat !== "Unknown") {
            specs.push(`Format: ${fileFormat}`);
        }
        if (fileSize && fileSize !== "---" && fileSize !== "Unknown") {
            specs.push(`Size: ${fileSize}`);
        }
        specs.push("Layered, well organized");
        specs.push("High Quality Resolution");
    }

    return (
        <div className="flex flex-col gap-12 w-full pt-2">
            {/* Specs List */}
            <ul className="flex flex-col gap-4">
                {specs.map((spec, idx) => {
                    const label = typeof spec === 'string' ? spec : (spec as any).label || 'Feature';
                    return (
                        <li key={idx} className="flex items-center gap-3 text-[14px] font-bold text-gray-700 tracking-wide">
                            <div className="shrink-0 text-gray-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>{label}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Newsletter Subscription */}
            <div className="flex flex-col gap-5">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Stay in the loop</h3>
                <p className="text-sm text-gray-600 leading-relaxed -mt-1">
                    Download latest news, events, changes to this platform and more directly in your inbox.
                </p>

                {subscribed ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium text-center">
                        Thanks for subscribing!
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mt-2">
                        {errorMsg && (
                            <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
                        )}
                        <input
                            type="email"
                            placeholder="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3.5 rounded-none border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-none bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Subscribing...
                                </>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div >
    );
}
