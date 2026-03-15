import React from 'react';

const License = () => {
    return (
        <div className="py-24 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="md:w-1/3">
                    <span className="text-indigo-400 font-semibold tracking-wider uppercase text-xs mb-3 block">Simple & Clear</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Flexible Licensing for Everyone</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                        We believe in simplicity. Our licenses are designed to let you focus on creating, not reading legal jargon.
                    </p>
                </div>

                <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Personal Use</h3>
                        <p className="text-zinc-400 mb-6">Perfect for side projects, learning, and personal portfolios.</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-zinc-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Unlimited personal projects
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                No attribution required
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Commercial Use</h3>
                        <p className="text-zinc-400 mb-6">Build real products, client websites, and commercial apps.</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-zinc-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Unlimited commercial projects
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Use in client work
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default License;
