"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes (optional auth to detect admin for draft visibility)
router.get('/', auth_middleware_1.optionalAuthenticate, blog_controller_1.getBlogs);
router.get('/:slug', auth_middleware_1.optionalAuthenticate, blog_controller_1.getBlogBySlug);
// Protected Admin/Developer Routes
router.post('/', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'DEVELOPER'), blog_controller_1.createBlog);
router.put('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'DEVELOPER'), blog_controller_1.updateBlog);
router.delete('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'DEVELOPER'), blog_controller_1.deleteBlog);
exports.default = router;
