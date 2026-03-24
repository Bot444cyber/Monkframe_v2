"use client";
import React from 'react';
import { ICONS } from '../page/home/ts/constants';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black overflow-hidden pt-24 pb-10 px-6 border-t border-white/5">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-white/15" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 mb-20">

          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                <img src="/svg/logo.svg" alt="Monkframe Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Monkframe</span>
            </div>
            <p className="text-zinc-600 text-sm max-w-xs mb-8 leading-relaxed">
              The world's most advanced marketplace for high-performance design assets. Built by designers, for creators.
            </p>

            <div className="flex gap-2">
              {[
                { Icon: ICONS.Discord, label: 'Discord' },
                { Icon: ICONS.Cart, label: 'Market' },
                {
                  Icon: () => (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                  ), label: 'Twitter'
                }
              ].map((social, i) => (
                <button
                  key={i}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
                >
                  <social.Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-6">Platform</h4>
              <ul className="space-y-3.5">
                {[
                  { label: 'Explore', href: '/' },
                  { label: 'Licenses', href: '/licenses' },
                  { label: 'Profile', href: '/profile' }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="text-zinc-600 hover:text-white transition-colors duration-200 text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-6">Support</h4>
              <ul className="space-y-3.5">
                {[
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Pricing', href: '/licenses' },
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="text-zinc-600 hover:text-white transition-colors duration-200 text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-6">Newsletter</h4>
              <p className="text-zinc-700 text-xs leading-relaxed mb-5">
                Latest drops and design resources, delivered monthly.
              </p>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-center bg-[#0d0d0d] border border-white/8 rounded-xl p-1 focus-within:border-white/20 transition-colors">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-none px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none"
                  />
                  <button className="px-3 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all">
                    Join
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-zinc-700">No spam, unsubscribe anytime.</p>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-zinc-700 text-[11px] uppercase tracking-[0.25em]">© 2025 Monkframe</p>
            <div className="h-3 w-px bg-white/5 hidden md:block" />
            <a href="/licenses" className="text-zinc-700 hover:text-white text-[11px] uppercase tracking-widest transition-colors">Licensing</a>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/8 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
