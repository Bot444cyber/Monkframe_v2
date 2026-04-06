
import React from 'react';
import { OverviewData, TrendingUI } from './types';
import TradingChart from './TradingChart';
import { formatDistanceToNow } from 'date-fns';

interface OverviewSectionProps {
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
    Grid: () => <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    Dollar: () => <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
};

const getColorStyles = (color: string) => {
    switch (color) {
        case 'emerald': return { bg: 'bg-amber-400/10', text: 'text-amber-500', border: 'border-amber-400/20', glow: 'bg-amber-400' };
        case 'indigo': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'bg-amber-500' };
        case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'bg-amber-500' };
        case 'rose': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'bg-rose-500' };
        default: return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'bg-amber-500' };
    }
};

const OverviewSection: React.FC<OverviewSectionProps> = ({ overviewData, handleLike, handleWishlist, setOpenCommentsId }) => {
    const [chartTimeRange, setChartTimeRange] = React.useState('7D');

    // safe access to data
    const payCompleted = overviewData?.paymentStatusDistribution?.completed || 0;
    const payPending = overviewData?.paymentStatusDistribution?.pending || 0;
    const payFailed = overviewData?.paymentStatusDistribution?.failed || 0;
    const payTotal = payCompleted + payPending + payFailed;

    const recentActivities = overviewData?.formattedActivities || [];
    const trendingUIs = overviewData?.trendingUIs || [];
    const graphData = overviewData?.graphData || [];
    const stats = overviewData?.stats || [];

    const displayStats = stats.map((stat) => {
        let icon = Icons.TrendingUp;
        let colorKey = stat.color || 'blue';

        // Normalize label for matching
        const label = stat.label?.toLowerCase() || '';

        // Note: 'Total Downloads' will be intercepted in render
        if (label.includes('download')) { icon = Icons.Download; colorKey = 'emerald'; }
        else if (label.includes('active user')) { icon = Icons.TrendingUp; colorKey = 'indigo'; }
        else if (label.includes('live ui')) { icon = Icons.Layers; colorKey = 'amber'; }


        return { ...stat, icon, styles: getColorStyles(colorKey) };
    });

    return (
        <div className="space-y-8 pb-20">
            {/* HERO METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayStats.map((stat, idx) => {
                    // Custom Revenue Widget (Replacing Total Downloads)
                    if (stat.label === 'Total Revenue') {
                        return (
                            <div key={idx} className="group relative p-6 rounded-3xl bg-card border border-border hover:border-border/80 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-500" />
                                <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24"><Icons.Dollar /></svg>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/5">
                                            +12.5%
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Revenue</p>
                                        <h3 className="text-4xl font-medium text-foreground tracking-tight flex items-baseline gap-1">
                                            <span className="text-2xl text-muted-foreground font-bold">$</span>
                                            {/* Using a distinct styling for revenue, mocking value scaling if needed, or using stat.value if appropriate */}
                                            {stat.value}
                                        </h3>
                                    </div>

                                    {/* Mini Sparkline Decoration */}
                                    <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="stroke-amber-500 stroke-2">
                                            <path d="M0 25 L10 20 L20 22 L30 10 L40 15 L50 5 L60 8" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    }

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
                                    <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${stat.change.includes('+') ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-rose-500/20 text-rose-400 bg-rose-500/5'}`}>
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
                {/* Fallback if no stats */}
                {displayStats.length === 0 && (
                    <div className="col-span-full p-8 text-center text-muted-foreground bg-card rounded-3xl border border-border">
                        No statistics available via API
                    </div>
                )}
            </div>

            {/* ANALYTICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ECOSYSTEM GROWTH / TRADING TERMINAL */}
                <div className="lg:col-span-8 bg-card border border-border p-8 rounded-[2.5rem] flex flex-col min-h-[480px] relative shadow-2xl overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[80px] rounded-full pointer-events-none -mr-16 -mt-16" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                Ecosystem Growth
                                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                    </span>
                                    Live
                                </span>
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">7-day ecosystem performance</p>
                        </div>

                        {overviewData.dailyStats && (
                            <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-xl border border-border/80 backdrop-blur-sm">
                                <div className="px-3 border-r border-border/50">
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Today's Vol</div>
                                    <div className="text-sm font-bold text-foreground">${overviewData.dailyStats.revenue.toLocaleString()}</div>
                                </div>
                                <div className="px-1">
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Target</div>
                                    <div className="text-xs font-bold text-muted-foreground/60">${overviewData.dailyStats.revenueGoal.toLocaleString()}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full min-h-[300px] relative z-10">
                        {overviewData.graphData && overviewData.graphData.length > 0 ? (
                            <TradingChart data={overviewData.graphData} />
                        ) : overviewData.hourlyStats && overviewData.hourlyStats.length > 0 ? (
                            <TradingChart data={overviewData.hourlyStats} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border border-dashed border-border/50 rounded-2xl bg-secondary/10">
                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Awaiting Market Data...</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-6 gap-4 relative z-10">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Users Acquisition</span>
                                    {overviewData.dailyStats && (
                                        <span className="text-xs font-bold text-foreground tabular-nums">{overviewData.dailyStats.users} <span className="text-muted-foreground/60 font-medium text-[10px]">Today</span></span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.6)]"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase">UIs Deployment</span>
                                    {overviewData.dailyStats && (
                                        <span className="text-xs font-bold text-foreground tabular-nums">{overviewData.dailyStats.uis} <span className="text-muted-foreground/60 font-medium text-[10px]">Today</span></span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/60">
                            UTC {new Date().toISOString().slice(11, 16)} • MARKET OPEN
                        </div>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="lg:col-span-4 space-y-8">
                    {/* ACTIVITY */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><Icons.Bell /></svg></span>
                                Terminal
                            </h3>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                            </span>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="flex gap-4 p-3.5 rounded-2xl bg-secondary/20 border border-border hover:border-primary/20 hover:bg-secondary/40 transition-all cursor-pointer group">
                                    <div className={`mt-0.5 min-w-[32px] h-8 rounded-lg flex items-center justify-center border ${activity.type === 'PAYMENT' ? 'bg-amber-500/10 border-amber-500/10 text-amber-500' : 'bg-amber-400/10 border-amber-400/10 text-amber-400'}`}>
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

                    {/* PAYMENT HEALTH */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl h-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Revenue Status</h3>
                            <span className="text-[10px] font-bold text-amber-500 px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/10 uppercase tracking-wider">Healthy</span>
                        </div>

                        <div className="flex h-2.5 w-full bg-muted rounded-full overflow-hidden mb-8 ring-1 ring-border/50 p-0.5">
                            {payTotal > 0 ? (
                                <>
                                    <div className="h-full rounded-l-full bg-amber-500 transition-all duration-1000" style={{ width: `${(payCompleted / payTotal) * 100}%` }} />
                                    <div className="h-full bg-amber-300 transition-all duration-1000" style={{ width: `${(payPending / payTotal) * 100}%` }} />
                                    <div className="h-full rounded-r-full bg-rose-500 transition-all duration-1000 flex-1" style={{ width: `${(payFailed / payTotal) * 100}%` }} />
                                </>
                            ) : (
                                <div className="w-full h-full bg-secondary/80 rounded-full" />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border text-center hover:bg-secondary/40 transition-colors">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1 block">Completed</span>
                                <span className="text-xl font-bold text-foreground tabular-nums">{payCompleted}</span>
                            </div>
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border text-center hover:bg-secondary/40 transition-colors">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1 block">Pending</span>
                                <span className="text-xl font-bold text-foreground tabular-nums">{payPending}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP PERFORMERS */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Market Movers</h3>
                    <button className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground transition-all bg-secondary/20 px-4 py-2 rounded-xl border border-border uppercase tracking-widest hover:bg-secondary/40">Global Ranking</button>
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
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/10">
                                        <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24"><Icons.Download /></svg>
                                        <span className="text-[10px] font-bold text-amber-500 tabular-nums">{ui.downloads}</span>
                                    </div>
                                    <button onClick={(e) => handleLike(e, ui.id)} className="flex items-center gap-1.5 group/btn">
                                        <svg className="w-4 h-4 text-muted-foreground/60 group-hover/btn:text-rose-500 transition-colors fill-current" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums group-hover/btn:text-foreground">{ui.likes}</span>
                                    </button>
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

export default OverviewSection;
