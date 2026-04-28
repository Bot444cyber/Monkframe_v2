/**
 * robots.ts — Robots.txt generator for www.mockupidea.com
 *
 * Served at: https://www.mockupidea.com/robots.txt
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Allow all well-behaved crawlers ─────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',   // Admin-only portal
          '/dashboard/',
          '/profile',     // Authenticated user profile
          '/profile/',
          '/payment',     // Transactional page — no SEO value
          '/payment/',
          '/contract',    // Internal empty route
          '/contract/',
          '/api/',        // Never expose raw API endpoints to crawlers
        ],
      },

      // ── Block AI training scrapers ───────────────────────────────────────
      { userAgent: 'GPTBot',         disallow: '/' },
      { userAgent: 'ChatGPT-User',   disallow: '/' },
      { userAgent: 'CCBot',          disallow: '/' },
      { userAgent: 'anthropic-ai',   disallow: '/' },
      { userAgent: 'ClaudeBot',      disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'Bytespider',     disallow: '/' },
      { userAgent: 'omgili',         disallow: '/' },
      { userAgent: 'omgilibot',      disallow: '/' },
    ],

    // ── Sitemap pointer ─────────────────────────────────────────────────────
    sitemap: 'https://www.mockupidea.com/sitemap.xml',

    // ── Crawl-delay hint (not respected by Google but honored by Bing) ──────
    // host: 'https://www.mockupidea.com', // optional canonical host
  };
}
