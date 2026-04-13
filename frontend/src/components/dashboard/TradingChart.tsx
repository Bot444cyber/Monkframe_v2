
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { GraphPoint } from './types';

interface TradingChartProps {
    data: GraphPoint[];
}

const SERIES = [
    { key: 'users', name: 'New Users', color: '#3b82f6', gradientId: 'gradUsers' },
    { key: 'uis', name: 'Live UIs', color: '#8b5cf6', gradientId: 'gradUIs' },
    { key: 'downloads', name: 'Downloads', color: '#06b6d4', gradientId: 'gradDownloads' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card/95 border border-border p-4 rounded-xl shadow-xl min-w-[160px]">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">
                {label} Report
            </p>
            <div className="space-y-2">
                {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="text-xs font-bold text-foreground tabular-nums">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TradingChart: React.FC<TradingChartProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        {SERIES.map(s => (
                            <linearGradient key={s.gradientId} id={s.gradientId} x1="0" y1="0" x2="0" y2="100%">
                                <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="currentColor"
                        strokeOpacity={0.05}
                    />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600, opacity: 0.5 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600, opacity: 0.5 }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'currentColor', strokeOpacity: 0.08, strokeWidth: 1 }}
                    />

                    {SERIES.map((s, i) => (
                        <Area
                            key={s.key}
                            name={s.name}
                            type="monotone"
                            dataKey={s.key}
                            stroke={s.color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${s.gradientId})`}
                            activeDot={{ r: 5, stroke: s.color, strokeWidth: 2, fill: 'var(--background)' }}
                            animationDuration={1200 + i * 300}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TradingChart;
// Re-export ChartFilter type for backwards compat if anything still imports it
export type { TradingChartProps };
export type ChartFilter = 'users' | 'uis' | 'downloads';
