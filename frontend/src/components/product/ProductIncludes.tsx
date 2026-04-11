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
        <div className="flex flex-col gap-14 w-full pt-4">
            {/* Specs List */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-gray-100" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Specifications</span>
                </div>
                <ul className="flex flex-col gap-5">
                    {specs.map((spec, idx) => {
                        const label = typeof spec === 'string' ? spec : (spec as any).label || 'Feature';
                        return (
                            <li key={idx} className="flex items-center gap-4 group cursor-default">
                                <div className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/5 text-blue-600 border border-blue-600/10 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[13px] font-bold text-gray-700 tracking-tight leading-none">{label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Newsletter Subscription */}

        </div >
    );
}
