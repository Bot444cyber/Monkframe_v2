import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticateUser, optionalAuthenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes (optional auth to detect admin for draft visibility)
router.get('/', optionalAuthenticate, getBlogs);
router.get('/:slug', optionalAuthenticate, getBlogBySlug);

// Protected Admin/Developer Routes
router.post('/', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), createBlog);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), updateBlog);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), deleteBlog);

export default router;
