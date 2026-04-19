import { Request, Response } from 'express';
import { db } from '../db';
import { blogs, users } from '../db/schema';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const getBlogs = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const offset = (pageNum - 1) * limitNum;

        // Build conditions array
        let conditions = [];

        // Public users only see PUBLISHED
        if ((req as any).user?.role === 'ADMIN' || (req as any).user?.role === 'DEVELOPER') {
            if (status) {
                conditions.push(eq(blogs.status, status as any));
            }
        } else {
            conditions.push(eq(blogs.status, 'PUBLISHED'));
        }

        if (search) {
            conditions.push(sql`LOWER(${blogs.title}) LIKE ${'%' + String(search).toLowerCase() + '%'}`);
        }

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        const results = await db.select({
            id: blogs.id,
            title: blogs.title,
            slug: blogs.slug,
            excerpt: blogs.excerpt,
            coverImage: blogs.coverImage,
            createdAt: blogs.created_at,
            category: blogs.category,
            views: blogs.views,
            status: blogs.status,
            author: {
                id: users.user_id,
                name: users.full_name
            }
        })
            .from(blogs)
            .leftJoin(users, eq(blogs.authorId, users.user_id))
            .where(whereCondition)
            .orderBy(desc(blogs.created_at))
            .limit(limitNum)
            .offset(offset);

        // Get total count
        const totalQuery = await db.select({ count: sql<number>`count(*)` })
            .from(blogs)
            .where(whereCondition);

        const total = totalQuery[0].count;

        res.json({
            status: true,
            data: results,
            meta: {
                total,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('getBlogs error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const result = await db.select({
            id: blogs.id,
            title: blogs.title,
            slug: blogs.slug,
            content: blogs.content,
            excerpt: blogs.excerpt,
            coverImage: blogs.coverImage,
            createdAt: blogs.created_at,
            category: blogs.category,
            views: blogs.views,
            status: blogs.status,
            author: {
                id: users.user_id,
                name: users.full_name
            }
        })
            .from(blogs)
            .leftJoin(users, eq(blogs.authorId, users.user_id))
            .where(eq(blogs.slug, slug));

        if (result.length === 0) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }

        const blog = result[0];

        // If not admin/dev and blog is draft, deny
        if (blog.status !== 'PUBLISHED') {
            const role = (req as any).user?.role;
            if (role !== 'ADMIN' && role !== 'DEVELOPER') {
                return res.status(404).json({ status: false, message: 'Blog not found' });
            }
        }

        // Increment views
        await db.update(blogs).set({ views: sql`${blogs.views} + 1` }).where(eq(blogs.id, blog.id));

        res.json({ status: true, data: blog });
    } catch (error) {
        console.error('getBlogBySlug error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

export const createBlog = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        const { title, slug, content, excerpt, coverImage, status, category, tags } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        const existing = await db.select().from(blogs).where(eq(blogs.slug, slug));
        if (existing.length > 0) {
            return res.status(400).json({ status: false, message: 'Slug already exists' });
        }

        await db.insert(blogs).values({
            id: randomUUID(),
            title,
            slug,
            content,
            excerpt,
            coverImage,
            authorId: userId,
            status: status || 'DRAFT',
            category,
            tags
        });

        res.json({ status: true, message: 'Blog created successfully' });
    } catch (error) {
        console.error('createBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, slug, content, excerpt, coverImage, status, category, tags } = req.body;

        const existing = await db.select().from(blogs).where(eq(blogs.id, id));
        if (existing.length === 0) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }

        if (slug && slug !== existing[0].slug) {
            const slugCheck = await db.select().from(blogs).where(eq(blogs.slug, slug));
            if (slugCheck.length > 0) {
                return res.status(400).json({ status: false, message: 'Slug already exists' });
            }
        }

        await db.update(blogs)
            .set({ title, slug, content, excerpt, coverImage, status, category, tags, updated_at: new Date() })
            .where(eq(blogs.id, id));

        res.json({ status: true, message: 'Blog updated successfully' });
    } catch (error) {
        console.error('updateBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(blogs).where(eq(blogs.id, id));
        res.json({ status: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('deleteBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};
