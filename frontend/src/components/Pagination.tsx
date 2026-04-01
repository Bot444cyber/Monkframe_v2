
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

        if (start > 1) {
            pages.push(
                <button key={1} onClick={() => onPageChange(1)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === 1 ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20'}`}>
                    1
                </button>
            );
            if (start > 2) pages.push(<span key="s-ellipsis" className="w-9 h-9 flex items-center justify-center text-muted-foreground/60 text-sm">···</span>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button key={i} onClick={() => onPageChange(i)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === i ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20'}`}>
                    {i}
                </button>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push(<span key="e-ellipsis" className="w-9 h-9 flex items-center justify-center text-muted-foreground/60 text-sm">···</span>);
            pages.push(
                <button key={totalPages} onClick={() => onPageChange(totalPages)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20'}`}>
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className={`flex items-center justify-center gap-1.5 mt-12 ${className}`}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            {renderPageNumbers()}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
        </div>
    );
}
