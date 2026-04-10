"use client";
import React from 'react';
import { Instagram, Facebook, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <img src="/logo/M_SHAPE.svg" alt="Logo" className="w-7 h-7 object-contain" />
              <span className="font-extrabold tracking-widest text-lg text-foreground">MOCKUPIDEA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-8">
              Crafting premium digital experiences through high-fidelity assets and thoughtful design.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-xl transition-all group shadow-sm ring-1 ring-border border-0">
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-xl transition-all group shadow-sm ring-1 ring-border border-0">
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-xl transition-all group shadow-sm ring-1 ring-border border-0">
                <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Column 2: Browse */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-8 py-1">Categories</h4>
            <ul className="space-y-4">
              <li><Link href="/?category=Flyer" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Flyer Design</Link></li>
              <li><Link href="/?category=Brochure" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Brochure Pack</Link></li>
              <li><Link href="/?category=Business Card" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Business Cards</Link></li>
              <li><Link href="/?category=Outdoor" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Outdoor Media</Link></li>
              <li><Link href="/?category=Packaging" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Packaging Sets</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-8 py-1">Essentials</h4>
            <ul className="space-y-4">
              <li><Link href="/licenses" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Licensing Info</Link></li>
              <li><Link href="/contact" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Contact Support</Link></li>
              <li><Link href="/faq" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Common FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div className="md:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-8 py-1">My Account</h4>
            <ul className="space-y-4">
              <li><Link href="/profile" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Your Profile</Link></li>
              <li><Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-blue-600 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full ring-1 ring-border">
            © 2026 MOCKUPIDEA. All rights reserved
          </p>
          <div className="flex gap-8">
            <a href="#" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-blue-600 transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" /> Platform Status
            </a>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
              Made with Precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
