
import React from 'react';
import { OverviewData, TrendingUI } from './types';
import TradingChart from './TradingChart';
import { formatDistanceToNow } from 'date-fns';
import OverviewSkeleton from './OverviewSkeleton';
import toast from 'react-hot-toast';

interface OverviewSectionProps {
    isLoading?: boolean;
    overviewData: OverviewData;
    handleLike: (e: React.MouseEvent, uiId: string) => void;
    handleWishlist: (e: React.MouseEvent, uiId: string) => void;
    setOpenCommentsId: (id: string | null) => void;
}

const Icons = {
    Download: () => <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
    TrendingUp: () => <path d="M23 6l-9.5 9.5-5-5L1 18" />,
    Zap: () => <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    Layers: () => <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    Bell: () => <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,

    FileDown: () => (
        <>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
        </>
    ),
    Users: () => (
        <>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </>
    ),
    Grid: () => <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
};

const getColorStyles = (color: string) => {
    switch (color) {
        case 'emerald': return { bg: 'bg-blue-600/10', text: 'text-blue-600', border: 'border-blue-600/20', glow: 'bg-blue-600' };
        case 'indigo': return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'bg-blue-500' };
        case 'blue': return { bg: 'bg-blue-600/10', text: 'text-blue-600', border: 'border-blue-600/20', glow: 'bg-blue-600' };
        case 'rose': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'bg-rose-500' };
        case 'teal': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'bg-emerald-500' };
        default: return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'bg-blue-500' };
    }
};

const OverviewSection: React.FC<OverviewSectionProps> = ({
    isLoading,
    overviewData,
    handleLike,
    handleWishlist,
    setOpenCommentsId,
}) => {

    if (isLoading) return <OverviewSkeleton />;



    const recentActivities = overviewData?.formattedActivities || [];
    const trendingUIs = overviewData?.trendingUIs || [];
    const graphData = overviewData?.graphData || [];
    const stats = overviewData?.stats || [];

    const displayStats = stats
        .filter((stat) => stat.label !== 'Total Revenue')
        .map((stat) => {
            let icon = Icons.TrendingUp;
            let colorKey = stat.color || 'blue';
            const label = stat.label?.toLowerCase() || '';

            if (label.includes('download')) { icon = Icons.Download; colorKey = 'emerald'; }
            else if (label.includes('active user')) { icon = Icons.TrendingUp; colorKey = 'indigo'; }
            else if (label.includes('live ui')) { icon = Icons.Layers; colorKey = 'blue'; }

            return { ...stat, icon, styles: getColorStyles(colorKey) };
        });

    // ─── Download Report ─────────────────────────────────────────────────────────
    const handleDownloadReport = () => {
        if (!graphData || graphData.length === 0) {
            toast.error('No graph data available to export.');
            return;
        }
        const headers = ['Day', 'Users', 'UIs', 'Downloads'];
        const rows = graphData.map(p => [
            p.day,
            p.users,
            p.uis,
            (p as any).downloads ?? 0,
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mockupidea_overview_report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Overview report downloaded!');
    };

    return (
        <div className="space-y-8 pb-20">

            {/* ── HEADER ACTIONS ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end">
                <button
                    onClick={handleDownloadReport}
                    className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-card border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-500 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-emerald-500/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] active:scale-95"
                    title="Download Overview as CSV"
                >
                    {/* Glow decoration */}
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                    <svg
                        className="w-4 h-4 fill-none stroke-current stroke-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0"
                        viewBox="0 0 24 24"
                    >
                        <Icons.FileDown />
                    </svg>
                    <span className="relative">Download Report</span>
                </button>
            </div>

            {/* ── HERO METRICS ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayStats.map((stat, idx) => {


                    return (
                        <div key={idx} className="group relative p-6 rounded-3xl bg-card border border-border hover:border-border/80 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden">
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${stat.styles.glow}`} />
                            <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${stat.styles.bg} ${stat.styles.text} border border-border`}>
                                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                                            <stat.icon />
                                        </svg>
                                    </div>
                                    <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${stat.change.includes('+') ? 'border-blue-500/20 text-blue-600 bg-blue-500/5' : 'border-rose-500/20 text-rose-400 bg-rose-500/5'}`}>
                                        {stat.change.includes('+') ? '↑' : '↓'} {stat.change.replace(/[+-]/g, '')}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                    <h3 className="text-4xl font-medium text-foreground tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {displayStats.length === 0 && (
                    <div className="col-span-full p-8 text-center text-muted-foreground bg-card rounded-3xl border border-border">
                        No statistics available via API
                    </div>
                )}
            </div>

            {/* ── ANALYTICS GRID ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ECOSYSTEM GROWTH / TRADING TERMINAL */}
                <div className="lg:col-span-8 bg-card border border-border p-8 rounded-[2.5rem] flex flex-col min-h-[480px] relative shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none -mr-16 -mt-16" />

                    {/* Chart Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                Ecosystem Growth
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600" />
                                    </span>
                                    Live
                                </span>
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">7-day ecosystem performance</p>
                        </div>

                        {/* ── SERIES LEGEND PILLS ── */}
                        <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-xl border border-border/80 backdrop-blur-sm">
                            {[
                                { label: 'Users', color: '#3b82f6' },
                                { label: 'UIs', color: '#8b5cf6' },
                                { label: 'Downloads', color: '#06b6d4' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-transparent">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}99` }}
                                    />
                                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: s.color }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Chart */}
                    <div className="flex-1 w-full min-h-[300px] relative z-10">
                        {graphData.length > 0 ? (
                            <TradingChart data={graphData} />
                        ) : overviewData.hourlyStats && overviewData.hourlyStats.length > 0 ? (
                            <TradingChart data={overviewData.hourlyStats} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border border-dashed border-border/50 rounded-2xl bg-secondary/10">
                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Awaiting Market Data...</span>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-6 gap-4 relative z-10">
                        <div className="flex flex-wrap gap-6">
                            {[
                                { label: 'Users Acquisition', color: '#1200FF', todayKey: 'users' },
                                { label: 'UIs Deployment', color: '#4E42FF', todayKey: 'uis' },
                                { label: 'Downloads', color: '#10b981', todayKey: null },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}88` }} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase">{s.label}</span>
                                        {overviewData.dailyStats && s.todayKey && (
                                            <span className="text-xs font-bold text-foreground tabular-nums">
                                                {(overviewData.dailyStats as any)[s.todayKey]}{' '}
                                                <span className="text-muted-foreground/60 font-medium text-[10px]">Today</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/60">
                            UTC {new Date().toISOString().slice(11, 16)} • MARKET OPEN
                        </div>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="lg:col-span-4 space-y-8">
                    {/* ACTIVITY */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] flex flex-col h-[400px] shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/10">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><Icons.Bell /></svg>
                                </span>
                                Terminal
                            </h3>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                            </span>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="flex gap-4 p-3.5 rounded-2xl bg-secondary/20 border border-border hover:border-primary/20 hover:bg-secondary/40 transition-all cursor-pointer group">
                                    <div className={`mt-0.5 min-w-[32px] h-8 rounded-lg flex items-center justify-center border ${activity.type === 'PAYMENT' ? 'bg-blue-600/10 border-blue-600/10 text-blue-600' : 'bg-blue-400/10 border-blue-400/10 text-blue-500'}`}>
                                        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                                            {activity.type === 'PAYMENT' ? <Icons.Zap /> : <Icons.TrendingUp />}
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors truncate">{activity.uiTitle || 'System Event'}</p>
                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tabular-nums">
                                                {activity.time && !isNaN(new Date(activity.time).getTime())
                                                    ? formatDistanceToNow(new Date(activity.time), { addSuffix: true }).replace('about ', '')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-snug font-mono">
                                            <span className="text-foreground font-semibold">{activity.user}</span> {activity.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentActivities.length === 0 && (
                                <div className="text-center text-muted-foreground/60 text-[10px] uppercase font-bold py-10">No recent activity</div>
                            )}
                        </div>
                    </div>


                </div>
            </div>

            {/* ── TOP PERFORMERS ──────────────────────────────────────────────────── */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Market Movers</h3>
                    <button className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground transition-all bg-secondary/20 px-4 py-2 rounded-xl border border-border uppercase tracking-widest hover:bg-secondary/40">
                        Global Ranking
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trendingUIs.slice(0, 3).map((ui: TrendingUI, idx: number) => (
                        <div key={idx} className="flex items-center gap-5 p-5 rounded-4xl bg-secondary/20 border border-border hover:bg-secondary/40 hover:border-border/80 transition-all group cursor-pointer hover:-translate-y-1 duration-300">
                            <div className="h-20 w-24 bg-muted rounded-2xl overflow-hidden border border-border relative shrink-0 shadow-lg">
                                <img src={ui.imageSrc} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ui.title} referrerPolicy="no-referrer" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-[13px] font-bold text-foreground truncate mb-3 group-hover:text-primary transition-colors">{ui.title}</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-600/10 border border-blue-600/10">
                                        <svg className="w-3 h-3 text-blue-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><Icons.Download /></svg>
                                        <span className="text-[10px] font-bold text-blue-600 tabular-nums">{ui.downloads}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trendingUIs.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground/60 font-bold uppercase text-[10px]">No trending assets</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(OverviewSection);
