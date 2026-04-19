import { Request, Response } from 'express';
import { db } from '../db';
import { notifications as notificationsTable, users, uis } from '../db/schema';
import { eq, desc, count, and } from 'drizzle-orm';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { role, user_id } = user;
        const userIdInt = parseInt(user_id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const scope = req.query.scope as string;
        let notificationsRes: any[] = [];
        let total = 0;

        if ((role === 'ADMIN' || role === 'DEVELOPER') && scope === 'all') {
            const [totalRes] = await db.select({ value: count() }).from(notificationsTable).where(eq(notificationsTable.status, 'PENDING'));
            total = totalRes.value;

            const rows = await db
                .select({
                    id: notificationsTable.id,
                    type: notificationsTable.type,
                    message: notificationsTable.message,
                    isRead: notificationsTable.isRead,
                    userId: notificationsTable.userId,
                    uiId: notificationsTable.uiId,
                    status: notificationsTable.status,
                    created_at: notificationsTable.created_at,
                    user_full_name: users.full_name,
                    user_email: users.email,
                    user_user_id: users.user_id,
                    ui_title: uis.title,
                    ui_id: uis.id,
                })
                .from(notificationsTable)
                .leftJoin(users, eq(users.user_id, notificationsTable.userId))
                .leftJoin(uis, eq(uis.id, notificationsTable.uiId))
                .where(eq(notificationsTable.status, 'PENDING'))
                .orderBy(desc(notificationsTable.created_at))
                .limit(limit)
                .offset(skip);

            notificationsRes = rows.map(r => ({
                id: r.id,
                type: r.type,
                message: r.message,
                isRead: r.isRead,
                status: r.status,
                userId: r.userId,
                uiId: r.uiId,
                created_at: r.created_at,
                user: r.user_user_id ? { full_name: r.user_full_name, email: r.user_email, user_id: r.user_user_id } : null,
                ui: r.ui_id ? { title: r.ui_title, id: r.ui_id } : null,
            }));

        } else {
            // For regular users OR Admin viewing personal notifications
            const [totalRes] = await db.select({ value: count() }).from(notificationsTable).where(eq(notificationsTable.userId, userIdInt));
            total = totalRes.value;

            const rows = await db
                .select({
                    id: notificationsTable.id,
                    type: notificationsTable.type,
                    message: notificationsTable.message,
                    isRead: notificationsTable.isRead,
                    userId: notificationsTable.userId,
                    uiId: notificationsTable.uiId,
                    created_at: notificationsTable.created_at,
                    ui_title: uis.title,
                    ui_id: uis.id,
                })
                .from(notificationsTable)
                .leftJoin(uis, eq(uis.id, notificationsTable.uiId))
                .where(eq(notificationsTable.userId, userIdInt))
                .orderBy(desc(notificationsTable.created_at))
                .limit(limit)
                .offset(skip);

            notificationsRes = rows.map(r => ({
                id: r.id,
                type: r.type,
                message: r.message,
                isRead: r.isRead,
                userId: r.userId,
                uiId: r.uiId,
                created_at: r.created_at,
                ui: r.ui_id ? { title: r.ui_title, id: r.ui_id } : null,
            }));
        }

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            status: true,
            data: notificationsRes,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

export const resolveNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.update(notificationsTable)
            .set({ status: 'FIXED', isRead: true })
            .where(eq(notificationsTable.id, id));
        return res.status(200).json({ status: true, message: "Notification marked as FIXED" });
    } catch (error) {
        console.error("Error resolving notification:", error);
        res.status(500).json({ error: "Failed to resolve notification" });
    }
};

export const dismissNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.update(notificationsTable)
            .set({ status: 'DISMISSED', isRead: true })
            .where(eq(notificationsTable.id, id));
        return res.status(200).json({ status: true, message: "Notification marked as DISMISSED" });
    } catch (error) {
        console.error("Error dismissing notification:", error);
        res.status(500).json({ error: "Failed to dismiss notification" });
    }
};
