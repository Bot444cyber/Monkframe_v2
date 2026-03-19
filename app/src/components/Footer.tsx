"use client";
import React from 'react';
import { ICONS } from '../page/home/ts/constants';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#050505] overflow-hidden pt-32 pb-12 px-6">
      {/* Top Gradient Separator - Sophisticated Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-[2px]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img src="/svg/logo.svg" alt="Monkframe Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tighter">Monkframe</span>
            </div>
            <p className="text-zinc-400 text-lg max-w-sm mb-10 leading-relaxed font-medium">
              The world's most advanced marketplace for high-performance design assets. Built by designers, for creators.
            </p>

            <div className="flex gap-3">
              {[
                { Icon: ICONS.Discord, label: 'Discord' },
                { Icon: ICONS.Cart, label: 'Market' },
                {
                  Icon: () => (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                  ), label: 'Twitter'
                }
              ].map((social, i) => (
                <button
                  key={i}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all duration-300 active:scale-90 group"
                >
                  <social.Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Explore', href: '/' },
                  { label: 'Licenses', href: '/licenses' },
                  { label: 'Profile', href: '/profile' }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="group flex items-center text-zinc-500 hover:text-white transition-all duration-300 text-sm font-medium">
                      <span className="relative">
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-8">Support</h4>
              <ul className="space-y-4">
                {[
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Pricing', href: '/licenses' },
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="group flex items-center text-zinc-500 hover:text-white transition-all duration-300 text-sm font-medium">
                      <span className="relative">
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-6">Stay Updated</h4>
              <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-medium">
                Join our exclusive newsletter for the latest drops and design resources.
              </p>

              <form className="relative group max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition duration-1000 blur"></div>
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl p-1 focus-within:border-indigo-500/50 transition-colors">
                  <svg className="w-5 h-5 text-zinc-600 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="email@monkframe.com"
                    className="w-full bg-transparent border-none px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-0"
                  />
                  <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/10">
                    Join
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-zinc-600">
                  No spam, unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.3em]">
              &copy; 2025 MONKFRAME
            </p>
            <div className="hidden md:block h-4 w-px bg-white/5" />
            <nav className="flex items-center gap-6">
              {/* Legal links placeholder - mapped to licenses for now or removed if strict */}
              <a href="/licenses" className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Licensing</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em]">
                Network Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Subtle Glows */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
};

export default Footer;
