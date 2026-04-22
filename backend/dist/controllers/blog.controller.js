"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const offset = (pageNum - 1) * limitNum;
        // Build conditions array
        let conditions = [];
        // Public users only see PUBLISHED
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN' || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'DEVELOPER') {
            if (status) {
                conditions.push((0, drizzle_orm_1.eq)(schema_1.blogs.status, status));
            }
        }
        else {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.blogs.status, 'PUBLISHED'));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.sql) `LOWER(${schema_1.blogs.title}) LIKE ${'%' + String(search).toLowerCase() + '%'}`);
        }
        const whereCondition = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const results = yield db_1.db.select({
            id: schema_1.blogs.id,
            title: schema_1.blogs.title,
            slug: schema_1.blogs.slug,
            excerpt: schema_1.blogs.excerpt,
            coverImage: schema_1.blogs.coverImage,
            createdAt: schema_1.blogs.created_at,
            category: schema_1.blogs.category,
            views: schema_1.blogs.views,
            status: schema_1.blogs.status,
            author: {
                id: schema_1.users.user_id,
                name: schema_1.users.full_name
            }
        })
            .from(schema_1.blogs)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogs.authorId, schema_1.users.user_id))
            .where(whereCondition)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.blogs.created_at))
            .limit(limitNum)
            .offset(offset);
        // Get total count
        const totalQuery = yield db_1.db.select({ value: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.blogs)
            .where(whereCondition);
        const total = ((_c = totalQuery[0]) === null || _c === void 0 ? void 0 : _c.value) || 0;
        res.json({
            status: true,
            data: results,
            meta: {
                total,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('getBlogs error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});
exports.getBlogs = getBlogs;
const getBlogBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { slug } = req.params;
        const result = yield db_1.db.select({
            id: schema_1.blogs.id,
            title: schema_1.blogs.title,
            slug: schema_1.blogs.slug,
            content: schema_1.blogs.content,
            excerpt: schema_1.blogs.excerpt,
            coverImage: schema_1.blogs.coverImage,
            createdAt: schema_1.blogs.created_at,
            category: schema_1.blogs.category,
            views: schema_1.blogs.views,
            status: schema_1.blogs.status,
            author: {
                id: schema_1.users.user_id,
                name: schema_1.users.full_name
            }
        })
            .from(schema_1.blogs)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogs.authorId, schema_1.users.user_id))
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.slug, slug));
        if (result.length === 0) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }
        const blog = result[0];
        // If not admin/dev and blog is draft, deny
        if (blog.status !== 'PUBLISHED') {
            const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            if (role !== 'ADMIN' && role !== 'DEVELOPER') {
                return res.status(404).json({ status: false, message: 'Blog not found' });
            }
        }
        // Increment views
        yield db_1.db.update(schema_1.blogs).set({ views: (0, drizzle_orm_1.sql) `${schema_1.blogs.views} + 1` }).where((0, drizzle_orm_1.eq)(schema_1.blogs.id, blog.id));
        res.json({ status: true, data: blog });
    }
    catch (error) {
        console.error('getBlogBySlug error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});
exports.getBlogBySlug = getBlogBySlug;
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.user_id;
        const { title, slug, content, excerpt, coverImage, status, category, tags } = req.body;
        if (!title || !slug || !content) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }
        const existing = yield db_1.db.select().from(schema_1.blogs).where((0, drizzle_orm_1.eq)(schema_1.blogs.slug, slug));
        if (existing.length > 0) {
            return res.status(400).json({ status: false, message: 'Slug already exists' });
        }
        yield db_1.db.insert(schema_1.blogs).values({
            id: (0, crypto_1.randomUUID)(),
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
    }
    catch (error) {
        console.error('createBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, slug, content, excerpt, coverImage, status, category, tags } = req.body;
        const existing = yield db_1.db.select().from(schema_1.blogs).where((0, drizzle_orm_1.eq)(schema_1.blogs.id, id));
        if (existing.length === 0) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }
        if (slug && slug !== existing[0].slug) {
            const slugCheck = yield db_1.db.select().from(schema_1.blogs).where((0, drizzle_orm_1.eq)(schema_1.blogs.slug, slug));
            if (slugCheck.length > 0) {
                return res.status(400).json({ status: false, message: 'Slug already exists' });
            }
        }
        yield db_1.db.update(schema_1.blogs)
            .set({ title, slug, content, excerpt, coverImage, status, category, tags, updated_at: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, id));
        res.json({ status: true, message: 'Blog updated successfully' });
    }
    catch (error) {
        console.error('updateBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.db.delete(schema_1.blogs).where((0, drizzle_orm_1.eq)(schema_1.blogs.id, id));
        res.json({ status: true, message: 'Blog deleted successfully' });
    }
    catch (error) {
        console.error('deleteBlog error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});
exports.deleteBlog = deleteBlog;
