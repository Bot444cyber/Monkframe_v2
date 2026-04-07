"use client";

// ─── Types ────────────────────────────────────────────────────────────────────
type Cell =
    | { type: 'photo'; src: string; round?: boolean }
    | { type: 'shape'; shape: 'sq' | 'circle' | 'rsq'; color: string }
    | { type: 'empty' };

const P = (src: string, round = false): Cell => ({ type: 'photo', src, round });
const SQ = (color: string): Cell => ({ type: 'shape', shape: 'sq', color });
const CI = (color: string): Cell => ({ type: 'shape', shape: 'circle', color });
const RS = (color: string): Cell => ({ type: 'shape', shape: 'rsq', color });
const EM = (): Cell => ({ type: 'empty' });

// Slim decorative shape colors — theme-aware
const C1 = 'var(--shape-1)';
const C2 = 'var(--shape-2)';
const C3 = 'var(--shape-3)';
const C4 = 'var(--shape-4)';

// 5 rows × 11 columns
const rows: Cell[][] = [
    [EM(), P('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', true), SQ(C2), EM(), CI(C3), P('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'), SQ(C1), RS(C3), P('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80'), CI(C1), SQ(C2)],
    [RS(C1), P('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80'), CI(C2), EM(), EM(), SQ(C3), P('https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', true), EM(), CI(C2), EM(), RS(C1)],
    [P('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', true), SQ(C1), P('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'), EM(), EM(), EM(), EM(), EM(), EM(), CI(C3), P('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', true)],
    [SQ(C2), P('https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80'), P('https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=100&q=80', true), RS(C3), EM(), CI(C1), P('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'), SQ(C4), CI(C2), EM(), RS(C3)],
    [P('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'), RS(C1), P('https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=100&q=80', true), P('https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80', true), SQ(C2), CI(C3), P('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'), SQ(C1), P('https://images.unsplash.com/photo-1520810627419-35e592be37ed?w=100&q=80', true), CI(C2), SQ(C3)],
];

// Slim quote strip below mosaic
const quotes = [
    { text: "Shipped 3 weeks ahead of schedule using MOCKUPIDEA kits.", author: "Priya N. · CTO, Flowstack" },
    { text: "Every asset looks like it was built by a senior designer.", author: "Jake M. · Freelance Designer" },
    { text: "Cut our design sprint time in half. Essential for any dev team.", author: "Lena F. · Lead Designer, Linear" },
    { text: "The dark mode quality is unreal — matches our brand out of the box.", author: "Omar K. · Startup Founder" },
    { text: "Finally a marketplace where quality is non-negotiable.", author: "Sara L. · Product Lead" },
];

// ─── Mosaic Cell ──────────────────────────────────────────────────────────────
function MosaicCell({ cell }: { cell: Cell }) {
    const base = "w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 shrink-0";
    if (cell.type === 'empty') return <div className={base} />;

    if (cell.type === 'photo') {
        return (
            <div className={`${base} overflow-hidden border border-white/8 ${cell.round ? 'rounded-full' : 'rounded-xl'}`}>
                <img src={cell.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
        );
    }

    const cls = cell.shape === 'circle' ? 'rounded-full' : cell.shape === 'rsq' ? 'rounded-2xl' : 'rounded-lg';
    return <div className={`${base} ${cls}`} style={{ backgroundColor: cell.color }} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SocialProof() {
    return (
        <section className="relative w-full bg-background py-20 sm:py-28 overflow-hidden border-t border-border">

            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* ── Mosaic grid + centered heading ── */}
                <div className="relative">
                    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 items-center">
                        {rows.map((row, ri) => (
                            <div key={ri} className="flex gap-3 sm:gap-4 lg:gap-6 items-center justify-center">
                                {row.map((cell, ci) => (
                                    <MosaicCell key={ci} cell={cell} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Centered absolute heading overlaid on grid */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div
                            className="px-8 py-6 sm:px-14 sm:py-8 text-center"
                            style={{ background: 'radial-gradient(ellipse at center, var(--background) 45%, transparent 80%)' }}
                        >
                            <p className="text-foreground/30 text-xs sm:text-sm font-medium mb-2 uppercase tracking-[0.25em]">
                                Our community
                            </p>
                            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-tighter text-foreground leading-[1.05] mb-4">
                                Loved by{' '}
                                <span className="text-foreground/40">
                                    12,000+
                                </span>
                                <br />
                                creators
                            </h2>
                            <p className="text-foreground/30 text-base sm:text-lg md:text-xl font-light">
                                designers &amp; developers who ship faster
                            </p>
                        </div>
                    </div>

                    {/* Edge fades — theme background */}
                    <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-linear-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-linear-to-l from-background to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-linear-to-b from-background to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
