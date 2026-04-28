/**
 * sitemap.ts — Auto-generated Sitemap for www.mockupidea.com
 *
 * HOW AUTO-UPDATE WORKS (no rebuild needed):
 * ─────────────────────────────────────────
 * Next.js ISR (Incremental Static Regeneration) serves a cached version of
 * /sitemap.xml and silently re-generates it in the background every 30 min.
 * So when a new product or blog post is added to the database, it will
 * automatically appear in the sitemap within 30 minutes — zero rebuilds.
 *
 * Timeline:
 *   0 min  → Admin adds a new product/blog
 *   ≤30 min → Next.js revalidates sitemap.ts, fetches fresh API data
 *   ≤30 min → /sitemap.xml now contains the new URL
 *   Next crawl → Google discovers and indexes the new page
 *
 * To make it faster: reduce `revalidate` below (e.g. 300 = 5 minutes).
 * To make it instant: set revalidate = 0 (fully dynamic, slower TTFB).
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';

// ─── ISR Revalidation Period ──────────────────────────────────────────────────
// Controls how often Next.js re-fetches all products/blogs from the API and
// regenerates /sitemap.xml in the background WITHOUT a rebuild.
// 43200 = 12 hours. Change to 1800 for 30 min, or 0 for fully dynamic.
export const revalidate = 43200;

// ─── Config ───────────────────────────────────────────────────────────────────

const SITE_URL = 'https://www.mockupidea.com';
const API_URL  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1000';

// Product categories used as the [category] segment in URLs
const PRODUCT_CATEGORIES = [
  'flyer',
  'brochure',
  'business-card',
  'outdoor',
  'book',
  'stationery',
  'packaging',
  'poster',
];

// Blog categories (filter tabs — listed here for future dedicated-route support)
const BLOG_CATEGORIES = [
  'design',
  'mockups',
  'tutorials',
  'inspiration',
  'resources',
  'news',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely fetch JSON from the internal API.
 * Returns `null` on any network / parse error so the sitemap
 * degrades gracefully rather than crashing the build.
 */
async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // Match the route-level revalidate so the fetch cache and page cache
      // stay in sync. Next.js will re-fetch from the API every 30 minutes.
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.status ? json : null;
  } catch {
    return null;
  }
}

// ─── Data Fetchers ────────────────────────────────────────────────────────────

interface ProductItem {
  slug: string;
  category: string;
  updatedAt?: string;
  createdAt?: string;
  imageSrc?: string;
  title?: string;
}

interface BlogItem {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  coverImage?: string;
  title?: string;
}

/**
 * Fetches ALL products across ALL pages for a given category.
 * Uses pagination to ensure every item is captured.
 */
async function fetchAllProducts(): Promise<ProductItem[]> {
  const items: ProductItem[] = [];
  const limit = 100;

  for (const category of PRODUCT_CATEGORIES) {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        category: category.replace(/-/g, ' '), // API expects "Business Card" not "business-card"
        status: 'PUBLISHED',
      });

      const data = await apiFetch<any>(`/api/uis?${params.toString()}`);

      if (!data?.data) break;

      const mapped: ProductItem[] = (data.data as any[]).map((ui) => ({
        slug:      ui.slug     ?? ui.id,
        category:  (ui.category ?? category).toLowerCase().replace(/\s+/g, '-'),
        updatedAt: ui.updatedAt ?? ui.createdAt,
        createdAt: ui.createdAt,
        imageSrc:  ui.imageSrc,
        title:     ui.title,
      }));

      items.push(...mapped);
      totalPages = data.meta?.totalPages ?? 1;
      page++;
    }
  }

  return items;
}

/**
 * Fetches ALL published blog articles across ALL pages.
 */
async function fetchAllBlogs(): Promise<BlogItem[]> {
  const items: BlogItem[] = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: 'PUBLISHED',
    });

    const data = await apiFetch<any>(`/api/blogs?${params.toString()}`);

    if (!data?.data) break;

    const mapped: BlogItem[] = (data.data as any[]).map((b) => ({
      slug:      b.slug      ?? b.id,
      updatedAt: b.updatedAt ?? b.createdAt,
      createdAt: b.createdAt,
      coverImage: b.coverImage,
      title:     b.title,
    }));

    items.push(...mapped);
    totalPages = data.meta?.totalPages ?? 1;
    page++;
  }

  return items;
}

// ─── Static Routes ────────────────────────────────────────────────────────────

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  // Tier 1 — Homepage
  {
    url:        `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority:   1.0,
  },

  // Tier 2 — Category browse pages (query-param filtered homepage)
  ...PRODUCT_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/?category=${encodeURIComponent(
      cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    )}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  })),

  // Tier 3 — Blog index
  {
    url:        `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority:   0.85,
  },

  // Tier 5 — Core informational pages
  {
    url:        `${SITE_URL}/contact`,
    lastModified: new Date('2026-04-28'),
    changeFrequency: 'monthly',
    priority:   0.7,
  },
  {
    url:        `${SITE_URL}/faq`,
    lastModified: new Date('2026-04-28'),
    changeFrequency: 'monthly',
    priority:   0.7,
  },
  {
    url:        `${SITE_URL}/licenses`,
    lastModified: new Date('2026-04-28'),
    changeFrequency: 'yearly',
    priority:   0.6,
  },

  // Tier 6 — Auth pages (low priority — no SEO value)
  {
    url:        `${SITE_URL}/login`,
    lastModified: new Date('2026-04-28'),
    changeFrequency: 'yearly',
    priority:   0.4,
  },
  {
    url:        `${SITE_URL}/signup`,
    lastModified: new Date('2026-04-28'),
    changeFrequency: 'yearly',
    priority:   0.4,
  },
];

// ─── Main Sitemap Export ───────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data in parallel
  const [products, blogs] = await Promise.all([
    fetchAllProducts(),
    fetchAllBlogs(),
  ]);

  // Build product URL entries
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/${product.category}/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Build blog URL entries
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Merge: static → products → blogs
  // (order matters for Google's crawl prioritization)
  return [
    ...STATIC_ROUTES,
    ...productEntries,
    ...blogEntries,
  ];
}
