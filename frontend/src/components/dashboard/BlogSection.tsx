"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
const CATS = ['Design', 'Mockups', 'Tutorials', 'Inspiration', 'Resources', 'News'];

type Status = 'DRAFT' | 'PUBLISHED';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    category?: string;
    status: Status;
    views: number;
    createdAt: string;
    author?: { id: number; name: string };
}

const defaultContent = `## Introduction

Start with a powerful hook that grabs the reader's attention. Include your primary keyword here within the first 100 words.

## Main Content

Break your content into digestible H2/H3 sections.

### Key Point 1

Keep paragraphs short (2-3 sentences). Use **bold** for emphasis.

- Bullet points for lists
- Keep items concise
- Add value with every point

## Conclusion

Summarize key points and add a clear call-to-action.`;

const emptyForm = { title: '', slug: '', excerpt: '', coverImage: '', category: 'Design', status: 'DRAFT' as Status, content: '' };

function slugify(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);

    function getToken() {
        try { return localStorage.getItem('auth_token') || ''; } catch { return ''; }
    }

    async function fetchBlogs() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/blogs?limit=50`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.status) setBlogs(data.data || []);
            else setBlogs([]);
        } catch (e) {
            console.error('fetchBlogs error:', e);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Lock body scroll when any modal is open
    useEffect(() => {
        if (isFormOpen || !!deleteId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFormOpen, deleteId]);

    function openAdd() {
        setEditId(null);
        setForm({ ...emptyForm });
        setIsFormOpen(true);
    }

    async function openEdit(blog: Blog) {
        setEditId(blog.id);
        setForm({ title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', coverImage: blog.coverImage || '', category: blog.category || 'Design', status: blog.status, content: '' });
        setIsFormOpen(true);
        // Fetch full content
        try {
            const res = await fetch(`${API}/api/blogs/${blog.slug}`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (data.status) setForm(f => ({ ...f, content: data.data.content || '' }));
        } catch (e) { console.error('fetch blog content error:', e); }
    }

    function handleTitle(val: string) {
        setForm(f => ({ ...f, title: val, slug: editId ? f.slug : slugify(val) }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const isEdit = !!editId;
        const url = isEdit ? `${API}/api/blogs/${editId}` : `${API}/api/blogs`;
        const t = toast.loading(isEdit ? 'Updating...' : 'Saving...');
        try {
            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message || 'Saved!', { id: t });
                setIsFormOpen(false);
                await fetchBlogs();
            } else {
                toast.error(data.message || 'Error saving', { id: t });
            }
        } catch {
            toast.error('Network error', { id: t });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        const t = toast.loading('Deleting...');
        try {
            const res = await fetch(`${API}/api/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (data.status) { toast.success('Deleted', { id: t }); setBlogs(b => b.filter(x => x.id !== id)); }
            else toast.error(data.message || 'Error', { id: t });
        } catch { toast.error('Network error', { id: t }); }
        setDeleteId(null);
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Content Management</p>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Articles</h2>
                    {!loading && <p className="text-sm text-muted-foreground mt-1">{blogs.length} article{blogs.length !== 1 ? 's' : ''}</p>}
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/25">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Write Article
                </button>
            </div>

            {/* SEO tip */}
            <div className="bg-blue-600/5 border border-blue-600/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-blue-600">SEO Tips: </span>
                    Keep H1 titles under 60 chars · Hook readers in first 100 words · Use H2/H3 subheadings · End with a clear CTA
                </p>
            </div>

            {/* Blog list */}
            {loading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map(i => <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />)}
                </div>
            ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl gap-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-muted-foreground">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-black text-foreground">No articles yet</p>
                        <p className="text-muted-foreground text-sm mt-1">Write your first SEO-optimized article to drive traffic.</p>
                    </div>
                    <button onClick={openAdd} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                        Write First Article
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {blogs.map(blog => (
                        <div key={blog.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl hover:border-blue-600/30 transition-all">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${blog.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                        {blog.status}
                                    </span>
                                    {blog.category && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">{blog.category}</span>}
                                </div>
                                <p className="text-sm font-bold text-foreground truncate max-w-sm">{blog.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">/blog/{blog.slug} · {blog.views} views · {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {blog.status === 'PUBLISHED' && (
                                    <Link href={`/blog/${blog.slug}`} target="_blank" className="h-9 px-3 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-1.5 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                        View
                                    </Link>
                                )}
                                <button onClick={() => openEdit(blog)} className="h-9 px-3 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-600 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                                    Edit
                                </button>
                                <button onClick={() => setDeleteId(blog.id)} className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Delete Modal ─── */}
            {deleteId && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-card border border-border rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center z-10">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-foreground mb-1">Delete Article?</h3>
                        <p className="text-sm text-muted-foreground mb-6">This is permanent and cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 h-11 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Create / Edit Modal ─── */}
            {isFormOpen && (
                <>
                    {/* Fixed backdrop */}
                    <div
                        className="fixed inset-0 z-[299] bg-black/70 backdrop-blur-md"
                        onClick={() => !saving && setIsFormOpen(false)}
                    />
                    {/* Scrollable wrapper */}
                    <div className="fixed inset-0 z-[300] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen p-4 pt-6 pb-16">
                            <div className="relative bg-card border border-border rounded-3xl w-full max-w-4xl shadow-2xl my-4 overflow-hidden">

                                {/* ── Cover image preview banner ── */}
                                <div className="relative w-full h-36 sm:h-44 overflow-hidden bg-muted">
                                    {form.coverImage ? (
                                        <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                            <span className="text-xs font-semibold">Cover image preview</span>
                                        </div>
                                    )}
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                                </div>

                                {/* ── Modal header ── */}
                                <div className="flex items-center justify-between px-8 py-5 border-b border-border -mt-10 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${form.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${form.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                                {form.status === 'PUBLISHED' ? 'Publishing' : 'Draft'}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black text-foreground">{editId ? 'Edit Article' : 'Write New Article'}</h2>
                                        <p className="text-xs text-muted-foreground mt-0.5">Markdown supported · Follow SEO structure for best results</p>
                                    </div>
                                    <button onClick={() => !saving && setIsFormOpen(false)} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                                            Title <span className={`font-normal normal-case tracking-normal ${form.title.length > 60 ? 'text-red-500' : 'text-blue-500'}`}>({form.title.length}/60 chars)</span>
                                        </label>
                                        <input type="text" value={form.title} onChange={e => handleTitle(e.target.value)} required maxLength={120}
                                            placeholder="A clear, keyword-rich title under 60 characters"
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground font-bold text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all" />
                                        {form.title.length > 60 && <p className="text-xs text-red-500 mt-1">⚠ Title exceeds 60 chars — may reduce search CTR</p>}
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">URL Slug</label>
                                        <div className="flex items-center h-12 bg-background border border-border rounded-xl overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                                            <span className="px-4 text-muted-foreground text-sm border-r border-border h-full flex items-center shrink-0 font-mono">/blog/</span>
                                            <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required placeholder="your-article-slug"
                                                className="flex-1 px-4 bg-transparent text-foreground text-sm font-mono outline-none" />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                                            Excerpt / Hook <span className="text-blue-500 font-normal normal-case tracking-normal">(Short intro shown in blog card — include primary keyword)</span>
                                        </label>
                                        <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
                                            placeholder="A compelling 1-2 sentence intro that captures attention..."
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none" />
                                    </div>

                                    {/* Row: category + status + cover */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Category</label>
                                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground text-sm focus:border-blue-600 outline-none transition-all">
                                                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Status</label>
                                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                                                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground text-sm focus:border-blue-600 outline-none transition-all">
                                                <option value="DRAFT">Draft</option>
                                                <option value="PUBLISHED">Published</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Cover Image URL</label>
                                            <input type="url" value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} placeholder="https://..."
                                                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground text-sm focus:border-blue-600 outline-none transition-all" />
                                        </div>
                                    </div>

                                    {/* Content: Markdown */}
                                    <div>
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Article Content (Markdown)</label>
                                        {/* ── Professional Formatting Toolbar ── */}
                                        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border border-border border-b-0 rounded-t-xl">
                                            <button type="button" title="Bold" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0, e2 = el.selectionEnd ?? 0; const sel = form.content.substring(s, e2); setForm(f => ({ ...f, content: f.content.substring(0, s) + `**${sel}**` + f.content.substring(e2) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, e2 + 2) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h4.125a3.375 3.375 0 110 6.75H6.75V3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.5h4.875a3.375 3.375 0 110 6.75H6.75V10.5z" /></svg>
                                            </button>
                                            <button type="button" title="Italic" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0, e2 = el.selectionEnd ?? 0; const sel = form.content.substring(s, e2); setForm(f => ({ ...f, content: f.content.substring(0, s) + `*${sel}*` + f.content.substring(e2) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 1, e2 + 1) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
                                            </button>
                                            <button type="button" title="Strikethrough" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0, e2 = el.selectionEnd ?? 0; const sel = form.content.substring(s, e2); setForm(f => ({ ...f, content: f.content.substring(0, s) + `~~${sel}~~` + f.content.substring(e2) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, e2 + 2) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12" /><path d="M16 6C16 6 14.5 4 12 4C9 4 7 6 7 8C7 11 10 12 12 12C14 12 17 13 17 16C17 18 15.5 20 12 20C9 20 7 18 7 18" /></svg>
                                            </button>
                                            <div className="w-px h-5 bg-border mx-0.5" />
                                            <button type="button" title="Heading 2" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const ls = form.content.substring(0, s).lastIndexOf('\n') + 1; setForm(f => ({ ...f, content: f.content.substring(0, ls) + '## ' + f.content.substring(ls) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 3, s + 3) }, 0); }} className="h-7 px-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 text-[10px] font-black transition-all">H2</button>
                                            <button type="button" title="Heading 3" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const ls = form.content.substring(0, s).lastIndexOf('\n') + 1; setForm(f => ({ ...f, content: f.content.substring(0, ls) + '### ' + f.content.substring(ls) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 4, s + 4) }, 0); }} className="h-7 px-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 text-[10px] font-black transition-all">H3</button>
                                            <div className="w-px h-5 bg-border mx-0.5" />
                                            <button type="button" title="Bullet list" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const ls = form.content.substring(0, s).lastIndexOf('\n') + 1; setForm(f => ({ ...f, content: f.content.substring(0, ls) + '- ' + f.content.substring(ls) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, s + 2) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                            </button>
                                            <button type="button" title="Blockquote" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const ls = form.content.substring(0, s).lastIndexOf('\n') + 1; setForm(f => ({ ...f, content: f.content.substring(0, ls) + '> ' + f.content.substring(ls) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, s + 2) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-60"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                            </button>
                                            <div className="w-px h-5 bg-border mx-0.5" />
                                            <button type="button" title="Link" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0, e2 = el.selectionEnd ?? 0; const sel = form.content.substring(s, e2) || 'link text'; setForm(f => ({ ...f, content: f.content.substring(0, s) + `[${sel}](url)` + f.content.substring(e2) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + sel.length + 3, s + sel.length + 6) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                            </button>
                                            <button type="button" title="Image" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const ins = '![alt text](image-url)'; setForm(f => ({ ...f, content: f.content.substring(0, s) + ins + f.content.substring(s) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, s + 10) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                            </button>
                                            <button type="button" title="Inline code" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0, e2 = el.selectionEnd ?? 0; const sel = form.content.substring(s, e2); setForm(f => ({ ...f, content: f.content.substring(0, s) + '`' + sel + '`' + f.content.substring(e2) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 1, e2 + 1) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                                            </button>
                                            <button type="button" title="Table" onClick={() => { const el = document.getElementById('article-content') as HTMLTextAreaElement; if (!el) return; const s = el.selectionStart ?? 0; const tableTpl = `\n\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1    | Data     | Data     |\n| Row 2    | Data     | Data     |\n\n`; setForm(f => ({ ...f, content: f.content.substring(0, s) + tableTpl + f.content.substring(s) })); setTimeout(() => { el.focus(); el.setSelectionRange(s + 4, s + 12) }, 0); }} className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 5.25h17.25a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.375a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 10.5h17.25M9 5.25v15M15 5.25v15" /></svg>
                                            </button>
                                            <span className="ml-auto text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest hidden sm:block">Select text → click</span>
                                        </div>
                                        <textarea id="article-content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={20}
                                            placeholder="Start writing your article in Markdown..."
                                            className="w-full px-4 py-3 bg-background border border-border rounded-b-xl text-foreground text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-y leading-relaxed" />
                                        <p className="text-[11px] text-muted-foreground mt-1.5">**bold** · *italic* · ~~strike~~ · ## H2 · ### H3 · - list · &gt; quote · [link](url) · ![img](url) · `code`</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => !saving && setIsFormOpen(false)} disabled={saving}
                                            className="h-12 px-8 rounded-2xl border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving}
                                            className="flex-1 h-12 px-8 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-wait">
                                            {saving ? 'Saving...' : editId ? 'Save Changes' : form.status === 'PUBLISHED' ? '🚀 Publish Article' : '💾 Save Draft'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
