import React from 'react';

export default function DashboardTableSkeleton({ columns = 4, rows = 5 }: { columns?: number, rows?: number }) {
    return (
        <div className="w-full bg-card rounded-[2rem] border border-border overflow-hidden animate-pulse">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-secondary/10">
                            {[...Array(columns)].map((_, i) => (
                                <th key={`h-${i}`} className="px-8 py-5">
                                    <div className="h-3 w-16 bg-muted-foreground/20 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[...Array(rows)].map((_, r) => (
                            <tr key={`r-${r}`}>
                                {[...Array(columns)].map((_, c) => (
                                    <td key={`c-${c}`} className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {c === 0 && <div className="h-10 w-14 bg-muted border border-border rounded-xl shrink-0" />}
                                            <div className="flex flex-col gap-2 w-full max-w-[140px]">
                                                <div className="h-4 w-full bg-muted rounded" />
                                                {c === 0 && <div className="h-3 w-2/3 bg-muted/50 rounded" />}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
