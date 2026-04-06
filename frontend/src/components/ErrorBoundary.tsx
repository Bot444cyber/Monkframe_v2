'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Log to console in dev, could send to Sentry/Datadog in prod
        if (process.env.NODE_ENV !== 'production') {
            console.error('[ErrorBoundary]', error, info.componentStack);
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                            An unexpected error occurred. Please refresh the page or try again later.
                        </p>
                        {process.env.NODE_ENV !== 'production' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-xs font-bold text-zinc-500 uppercase tracking-widest cursor-pointer mb-2">
                                    Error Details (dev only)
                                </summary>
                                <pre className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 overflow-auto max-h-48">
                                    {this.state.error.message}
                                    {'\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors mr-3"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
