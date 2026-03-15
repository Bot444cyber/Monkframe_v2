
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { GraphPoint } from './types';

interface TradingChartProps {
    data: GraphPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0c0c0e]/90 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-2xl">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{label} Report</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-medium text-zinc-400">{entry.name}</span>
                            </div>
                            <span className="text-xs font-bold text-white tabular-nums">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const TradingChart: React.FC<TradingChartProps> = ({ data }) => {
    // Safety check just in case, though parent handles it too
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUIs" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#52525b', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#52525b', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fff', strokeOpacity: 0.1, strokeWidth: 1 }} />
                    <Area
                        name="New Users"
                        type="monotone"
                        dataKey="users"
                        stroke="#6366f1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#09090b' }}
                        animationDuration={1500}
                    />
                    <Area
                        name="Live UIs"
                        type="monotone"
                        dataKey="uis"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorUIs)"
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#09090b' }}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TradingChart;
