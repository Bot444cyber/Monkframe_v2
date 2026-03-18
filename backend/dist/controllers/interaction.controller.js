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
exports.deleteComment = exports.getComments = exports.addComment = exports.toggleWishlist = exports.toggleLike = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
// Toggle Like
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId)
            return res.status(401).json({ status: false, message: "Unauthorized" });
        // Fetch user details for notification
        const [userDetails] = yield db_1.db.select({ full_name: schema_1.users.full_name, email: schema_1.users.email }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, userId)).limit(1);
        const [existingLike] = yield db_1.db.select().from(schema_1.likes).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.likes.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.likes.ui_id, id))).limit(1);
        if (existingLike) {
            // Unlike
            yield db_1.db.delete(schema_1.likes).where((0, drizzle_orm_1.eq)(schema_1.likes.id, existingLike.id));
            yield db_1.db.update(schema_1.uis).set({ likes: (0, drizzle_orm_1.sql) `${schema_1.uis.likes} - 1` }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
            const [updatedUI] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
            return res.json({ status: true, message: "Unliked", liked: false, likesCount: updatedUI === null || updatedUI === void 0 ? void 0 : updatedUI.likes });
        }
        else {
            // Like
            yield db_1.db.insert(schema_1.likes).values({
                id: (0, crypto_1.randomUUID)(),
                user_id: userId,
                ui_id: id
            });
            yield db_1.db.update(schema_1.uis).set({ likes: (0, drizzle_orm_1.sql) `${schema_1.uis.likes} + 1` }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
            const [updatedUI] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
            // Create Notification
            try {
                const notificationId = (0, crypto_1.randomUUID)();
                yield db_1.db.insert(schema_1.notifications).values({
                    id: notificationId,
                    type: 'LIKE',
                    message: `${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.full_name) || 'User'} liked UI: ${updatedUI === null || updatedUI === void 0 ? void 0 : updatedUI.title}`,
                    userId: userId,
                    uiId: id,
                    isRead: false
                });
                const payload = {
                    id: notificationId,
                    type: 'LIKE',
                    message: `${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.full_name) || 'User'} liked UI: ${updatedUI === null || updatedUI === void 0 ? void 0 : updatedUI.title}`,
                    userId: userId,
                    uiId: id,
                    user: userDetails,
                    ui: { title: updatedUI === null || updatedUI === void 0 ? void 0 : updatedUI.title }
                };
            }
            catch (err) {
                console.error("Notification error", err);
            }
            return res.json({ status: true, message: "Liked", liked: true, likesCount: updatedUI === null || updatedUI === void 0 ? void 0 : updatedUI.likes });
        }
    }
    catch (error) {
        console.error("Toggle Like Error:", error);
        res.status(500).json({ status: false, message: "Action failed" });
    }
});
exports.toggleLike = toggleLike;
// Toggle Wishlist
const toggleWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId)
            return res.status(401).json({ status: false, message: "Unauthorized" });
        const [existingWish] = yield db_1.db.select().from(schema_1.wishlists).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.wishlists.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.wishlists.ui_id, id))).limit(1);
        // Fetch user details for notification (recycle if possible, but safe to fetch here if not above)
        // Since this is a separate function, we need to fetch again or reuse logic.
        const [userDetails] = yield db_1.db.select({ full_name: schema_1.users.full_name, email: schema_1.users.email }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, userId)).limit(1);
        if (existingWish) {
            yield db_1.db.delete(schema_1.wishlists).where((0, drizzle_orm_1.eq)(schema_1.wishlists.id, existingWish.id));
            return res.json({ status: true, message: "Removed from wishlist", wished: false });
        }
        else {
            yield db_1.db.insert(schema_1.wishlists).values({
                id: (0, crypto_1.randomUUID)(),
                user_id: userId,
                ui_id: id
            });
            // Create Notification
            try {
                // Fetch UI title for message
                const [ui] = yield db_1.db.select({ title: schema_1.uis.title }).from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
                const notificationId = (0, crypto_1.randomUUID)();
                yield db_1.db.insert(schema_1.notifications).values({
                    id: notificationId,
                    type: 'WISHLIST',
                    message: `${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.full_name) || 'User'} added to wishlist: ${(ui === null || ui === void 0 ? void 0 : ui.title) || id}`,
                    userId: userId,
                    uiId: id,
                    isRead: false
                });
                const payload = {
                    id: notificationId,
                    type: 'WISHLIST',
                    message: `${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.full_name) || 'User'} added to wishlist: ${(ui === null || ui === void 0 ? void 0 : ui.title) || id}`,
                    userId: userId,
                    uiId: id,
                    user: userDetails,
                    ui: { title: ui === null || ui === void 0 ? void 0 : ui.title }
                };
            }
            catch (err) {
                console.error("Notification error", err);
            }
            return res.json({ status: true, message: "Added to wishlist", wished: true });
        }
    }
    catch (error) {
        console.error("Toggle Wishlist Error:", error);
        res.status(500).json({ status: false, message: "Action failed" });
    }
});
exports.toggleWishlist = toggleWishlist;
// Add Comment
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id } = req.params; // UI ID
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId)
            return res.status(401).json({ status: false, message: "Unauthorized" });
        if (!content || !content.trim())
            return res.status(400).json({ status: false, message: "Content required" });
        const commentId = (0, crypto_1.randomUUID)();
        yield db_1.db.insert(schema_1.comments).values({
            id: commentId,
            content,
            user_id: userId,
            ui_id: id
        });
        // Fetch the inserted comment with user details via leftJoin
        const [commentRow] = yield db_1.db
            .select({
            id: schema_1.comments.id,
            content: schema_1.comments.content,
            user_id: schema_1.comments.user_id,
            ui_id: schema_1.comments.ui_id,
            created_at: schema_1.comments.created_at,
            updated_at: schema_1.comments.updated_at,
            user_full_name: schema_1.users.full_name,
            user_email: schema_1.users.email,
        })
            .from(schema_1.comments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.comments.user_id))
            .where((0, drizzle_orm_1.eq)(schema_1.comments.id, commentId))
            .limit(1);
        const comment = commentRow ? Object.assign(Object.assign({}, commentRow), { user: commentRow.user_full_name ? { full_name: commentRow.user_full_name, email: commentRow.user_email } : null }) : null;
        // Create Notification
        try {
            // Fetch UI title
            const [ui] = yield db_1.db.select({ title: schema_1.uis.title }).from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
            const notificationId = (0, crypto_1.randomUUID)();
            yield db_1.db.insert(schema_1.notifications).values({
                id: notificationId,
                type: 'COMMENT',
                message: `${((_b = comment === null || comment === void 0 ? void 0 : comment.user) === null || _b === void 0 ? void 0 : _b.full_name) || 'User'} commented on: ${(ui === null || ui === void 0 ? void 0 : ui.title) || id}`,
                userId: userId,
                uiId: id,
                isRead: false
            });
            const payload = {
                id: notificationId,
                type: 'COMMENT',
                message: `${((_c = comment === null || comment === void 0 ? void 0 : comment.user) === null || _c === void 0 ? void 0 : _c.full_name) || 'User'} commented on: ${(ui === null || ui === void 0 ? void 0 : ui.title) || id}`,
                userId: userId,
                uiId: id,
                user: comment === null || comment === void 0 ? void 0 : comment.user,
                ui: { title: ui === null || ui === void 0 ? void 0 : ui.title }
            };
        }
        catch (err) {
            console.error("Notification error", err);
        }
        res.json({ status: true, message: "Comment added", data: comment });
    }
    catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ status: false, message: "Failed to add comment" });
    }
});
exports.addComment = addComment;
// Get Comments
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [totalRes] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, id));
        const total = totalRes.value;
        const rows = yield db_1.db
            .select({
            id: schema_1.comments.id,
            content: schema_1.comments.content,
            user_id: schema_1.comments.user_id,
            ui_id: schema_1.comments.ui_id,
            created_at: schema_1.comments.created_at,
            updated_at: schema_1.comments.updated_at,
            user_full_name: schema_1.users.full_name,
            user_email: schema_1.users.email,
        })
            .from(schema_1.comments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.comments.user_id))
            .where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.comments.created_at))
            .limit(limit)
            .offset(skip);
        const commentsRes = rows.map(r => ({
            id: r.id,
            content: r.content,
            user_id: r.user_id,
            ui_id: r.ui_id,
            created_at: r.created_at,
            updated_at: r.updated_at,
            user: r.user_full_name ? { full_name: r.user_full_name, email: r.user_email } : null,
        }));
        const totalPages = Math.ceil(total / limit);
        res.json({
            status: true,
            data: commentsRes,
            meta: { page, limit, total, totalPages }
        });
    }
    catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch comments" });
    }
});
exports.getComments = getComments;
// Delete Comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        const [comment] = yield db_1.db.select().from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.id, commentId)).limit(1);
        if (!comment)
            return res.status(404).json({ status: false, message: "Comment not found" });
        if (comment.user_id !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }
        yield db_1.db.delete(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.id, commentId));
        res.json({ status: true, message: "Comment deleted" });
    }
    catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ status: false, message: "Failed to delete comment" });
    }
});
exports.deleteComment = deleteComment;
