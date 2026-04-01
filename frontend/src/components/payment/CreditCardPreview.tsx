import React, { useMemo } from 'react';

interface CreditCardPreviewProps {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvc: string;
    isFlipped: boolean;
}

export default function CreditCardPreview({
    cardNumber,
    cardHolder,
    expiryDate,
    cvc,
    isFlipped
}: CreditCardPreviewProps) {
    // Determine card brand (simple check)
    const cardBrand = useMemo(() => {
        if (cardNumber.startsWith('4')) return 'Visa';
        if (cardNumber.startsWith('5')) return 'Mastercard';
        return 'Card';
    }, [cardNumber]);

    return (
        <div className="perspective-1000 w-full max-w-[320px] h-[200px] mx-auto">
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full bg-card rounded-2xl shadow-2xl backface-hidden border border-border overflow-hidden transition-colors duration-500">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px]"></div>

                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            {/* Chip */}
                            <div className="w-12 h-9 bg-linear-to-br from-yellow-200 to-yellow-400 rounded-md shadow-inner border border-yellow-500/50 flex flex-col justify-center gap-1 p-1 opacity-90">
                                <div className="h-px w-full bg-black/20"></div>
                                <div className="h-px w-full bg-black/20"></div>
                                <div className="h-px w-full bg-black/20"></div>
                            </div>
                            {/* Brand Logo */}
                            <div className="text-foreground font-bold italic tracking-wider opacity-80">
                                {cardBrand}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-2xl font-mono text-foreground tracking-widest drop-shadow-sm">
                                {cardNumber || "#### #### #### ####"}
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">Card Holder</span>
                                <span className="text-sm font-medium text-foreground uppercase tracking-wide truncate max-w-[150px]">
                                    {cardHolder || "FULL NAME"}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">Expires</span>
                                <span className="text-sm font-mono text-foreground">{expiryDate || "MM/YY"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full bg-card rounded-2xl shadow-2xl backface-hidden rotate-y-180 border border-border overflow-hidden transition-colors duration-500">
                    {/* Magnetic Strip */}
                    <div className="w-full h-12 bg-secondary/80 mt-6 backdrop-blur-sm"></div>

                    <div className="p-6">
                        <div className="flex flex-col items-end gap-1 mt-2">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mr-1">CVC</span>
                            <div className="w-full h-10 bg-secondary/50 border border-border rounded-md flex items-center justify-end px-3">
                                <span className="font-mono text-foreground font-bold tracking-widest transform translate-y-[1px]">
                                    {cvc || "***"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center opacity-10">
                            <svg className="w-12 h-12 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
