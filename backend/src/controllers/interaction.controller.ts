import { Request, Response } from 'express';
import { db } from '../db';
import { likes, wishlists, comments, uis, notifications, users } from '../db/schema';
import { eq, and, sql, count, desc } from 'drizzle-orm';
import { getIO } from '../config/socket';
import { randomUUID } from 'crypto';

// Toggle Like
export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

        // Fetch user details for notification
        const userDetails = await db.query.users.findFirst({
            where: eq(users.user_id, userId),
            columns: { full_name: true, email: true }
        });

        const existingLike = await db.query.likes.findFirst({
            where: and(eq(likes.user_id, userId), eq(likes.ui_id, id))
        });

        if (existingLike) {
            // Unlike
            await db.delete(likes).where(eq(likes.id, existingLike.id));
            await db.update(uis).set({ likes: sql`${uis.likes} - 1` }).where(eq(uis.id, id));

            const updatedUI = await db.query.uis.findFirst({ where: eq(uis.id, id) });

            // Emit real-time update
            getIO().emit('like:updated', { uiId: id, likesCount: updatedUI?.likes, liked: false, userId });

            return res.json({ status: true, message: "Unliked", liked: false, likesCount: updatedUI?.likes });
        } else {
            // Like
            await db.insert(likes).values({
                id: randomUUID(),
                user_id: userId,
                ui_id: id
            });
            await db.update(uis).set({ likes: sql`${uis.likes} + 1` }).where(eq(uis.id, id));
            const updatedUI = await db.query.uis.findFirst({ where: eq(uis.id, id) });

            // Create Notification
            try {
                const notificationId = randomUUID();
                await db.insert(notifications).values({
                    id: notificationId,
                    type: 'LIKE',
                    message: `${userDetails?.full_name || 'User'} liked UI: ${updatedUI?.title}`,
                    userId: userId,
                    uiId: id,
                    isRead: false
                });

                const payload = {
                    id: notificationId,
                    type: 'LIKE',
                    message: `${userDetails?.full_name || 'User'} liked UI: ${updatedUI?.title}`,
                    userId: userId,
                    uiId: id,
                    user: userDetails,
                    ui: { title: updatedUI?.title }
                };
                getIO().to(userId.toString()).emit('new-notification', payload);
                getIO().to('admin').emit('new-notification', payload);
            } catch (err) {
                console.error("Notification error", err);
            }

            // Emit real-time update
            getIO().emit('like:updated', { uiId: id, likesCount: updatedUI?.likes, liked: true, userId });

            return res.json({ status: true, message: "Liked", liked: true, likesCount: updatedUI?.likes });
        }
    } catch (error) {
        console.error("Toggle Like Error:", error);
        res.status(500).json({ status: false, message: "Action failed" });
    }
};

// Toggle Wishlist
export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

        const existingWish = await db.query.wishlists.findFirst({
            where: and(eq(wishlists.user_id, userId), eq(wishlists.ui_id, id))
        });

        // Fetch user details for notification (recycle if possible, but safe to fetch here if not above)
        // Since this is a separate function, we need to fetch again or reuse logic.
        const userDetails = await db.query.users.findFirst({
            where: eq(users.user_id, userId),
            columns: { full_name: true, email: true }
        });

        if (existingWish) {
            await db.delete(wishlists).where(eq(wishlists.id, existingWish.id));

            // Emit real-time update
            getIO().emit('wishlist:updated', { uiId: id, wished: false, userId });

            return res.json({ status: true, message: "Removed from wishlist", wished: false });
        } else {
            await db.insert(wishlists).values({
                id: randomUUID(),
                user_id: userId,
                ui_id: id
            });

            // Create Notification
            try {
                // Fetch UI title for message
                const ui = await db.query.uis.findFirst({ where: eq(uis.id, id), columns: { title: true } });
                const notificationId = randomUUID();
                await db.insert(notifications).values({
                    id: notificationId,
                    type: 'WISHLIST',
                    message: `${userDetails?.full_name || 'User'} added to wishlist: ${ui?.title || id}`,
                    userId: userId,
                    uiId: id,
                    isRead: false
                });

                const payload = {
                    id: notificationId,
                    type: 'WISHLIST',
                    message: `${userDetails?.full_name || 'User'} added to wishlist: ${ui?.title || id}`,
                    userId: userId,
                    uiId: id,
                    user: userDetails,
                    ui: { title: ui?.title }
                };
                getIO().to(userId.toString()).emit('new-notification', payload);
                getIO().to('admin').emit('new-notification', payload);
            } catch (err) {
                console.error("Notification error", err);
            }

            // Emit real-time update
            getIO().emit('wishlist:updated', { uiId: id, wished: true, userId });

            return res.json({ status: true, message: "Added to wishlist", wished: true });
        }

    } catch (error) {
        console.error("Toggle Wishlist Error:", error);
        res.status(500).json({ status: false, message: "Action failed" });
    }
};

// Add Comment
export const addComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // UI ID
        const { content } = req.body;
        const userId = req.user?.user_id;

        if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });
        if (!content || !content.trim()) return res.status(400).json({ status: false, message: "Content required" });

        const commentId = randomUUID();
        await db.insert(comments).values({
            id: commentId,
            content,
            user_id: userId,
            ui_id: id
        });

        // Fetch the inserted comment with user details via leftJoin
        const [commentRow] = await db
            .select({
                id: comments.id,
                content: comments.content,
                user_id: comments.user_id,
                ui_id: comments.ui_id,
                created_at: comments.created_at,
                updated_at: comments.updated_at,
                user_full_name: users.full_name,
                user_email: users.email,
            })
            .from(comments)
            .leftJoin(users, eq(users.user_id, comments.user_id))
            .where(eq(comments.id, commentId))
            .limit(1);

        const comment = commentRow ? {
            ...commentRow,
            user: commentRow.user_full_name ? { full_name: commentRow.user_full_name, email: commentRow.user_email } : null
        } : null;

        // Create Notification
        try {
            // Fetch UI title
            const ui = await db.query.uis.findFirst({ where: eq(uis.id, id), columns: { title: true } });
            const notificationId = randomUUID();
            await db.insert(notifications).values({
                id: notificationId,
                type: 'COMMENT',
                message: `${comment?.user?.full_name || 'User'} commented on: ${ui?.title || id}`,
                userId: userId,
                uiId: id,
                isRead: false
            });

            const payload = {
                id: notificationId,
                type: 'COMMENT',
                message: `${comment?.user?.full_name || 'User'} commented on: ${ui?.title || id}`,
                userId: userId,
                uiId: id,
                user: comment?.user,
                ui: { title: ui?.title }
            };
            getIO().to(userId.toString()).emit('new-notification', payload);
            getIO().to('admin').emit('new-notification', payload);
        } catch (err) {
            console.error("Notification error", err);
        }

        // Emit real-time update
        getIO().emit('comment:added', { uiId: id, comment });

        res.json({ status: true, message: "Comment added", data: comment });
    } catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ status: false, message: "Failed to add comment" });
    }
};

// Get Comments
export const getComments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [totalRes] = await db.select({ value: count() }).from(comments).where(eq(comments.ui_id, id));
        const total = totalRes.value;

        const rows = await db
            .select({
                id: comments.id,
                content: comments.content,
                user_id: comments.user_id,
                ui_id: comments.ui_id,
                created_at: comments.created_at,
                updated_at: comments.updated_at,
                user_full_name: users.full_name,
                user_email: users.email,
            })
            .from(comments)
            .leftJoin(users, eq(users.user_id, comments.user_id))
            .where(eq(comments.ui_id, id))
            .orderBy(desc(comments.created_at))
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
    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch comments" });
    }
};

// Delete Comment
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.user_id;

        const comment = await db.query.comments.findFirst({ where: eq(comments.id, commentId) });
        if (!comment) return res.status(404).json({ status: false, message: "Comment not found" });

        if (comment.user_id !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }

        await db.delete(comments).where(eq(comments.id, commentId));
        res.json({ status: true, message: "Comment deleted" });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ status: false, message: "Failed to delete comment" });
    }
};
