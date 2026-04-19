import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
    blog: {
        id: string;
        title: string;
        slug: string;
        excerpt?: string;
        coverImage?: string;
        category?: string;
        createdAt: string;
        author?: { id: number; name: string };
    };
}

export default function BlogCard({ blog }: BlogCardProps) {
    const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    // Estimate reading time (200 wpm avg)
    const readTime = blog.excerpt ? Math.max(1, Math.ceil(blog.excerpt.split(' ').length / 200)) : 3;

    return (
        <Link href={`/blog/${blog.slug}`} className="group flex flex-col gap-0 cursor-pointer">
            {/* Cover Image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                {blog.coverImage ? (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-blue-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                    </div>
                )}
                {/* Category badge */}
                {blog.category && (
                    <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 border border-white/50 shadow-sm">
                            {blog.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-2">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>{readTime} min read</span>
                {blog.author?.name && (
                    <>
                        <span>·</span>
                        <span>{blog.author.name}</span>
                    </>
                )}
            </div>

            {/* Title */}
            <h3 className="text-base font-black text-gray-900 leading-snug tracking-tight mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.excerpt && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {blog.excerpt}
                </p>
            )}

            {/* Read more */}
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-black uppercase tracking-widest mt-auto transition-all duration-200 group-hover:gap-2.5">
                Read Article
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </Link>
    );
}
