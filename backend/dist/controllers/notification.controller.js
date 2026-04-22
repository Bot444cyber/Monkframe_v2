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
exports.dismissNotification = exports.resolveNotification = exports.getNotifications = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { role, user_id } = user;
        const userIdInt = parseInt(user_id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const scope = req.query.scope;
        let notificationsRes = [];
        let total = 0;
        if ((role === 'ADMIN' || role === 'DEVELOPER') && scope === 'all') {
            const [totalRes] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.status, 'PENDING'));
            total = totalRes.value;
            const rows = yield db_1.db
                .select({
                id: schema_1.notifications.id,
                type: schema_1.notifications.type,
                message: schema_1.notifications.message,
                isRead: schema_1.notifications.isRead,
                userId: schema_1.notifications.userId,
                uiId: schema_1.notifications.uiId,
                status: schema_1.notifications.status,
                created_at: schema_1.notifications.created_at,
                user_full_name: schema_1.users.full_name,
                user_email: schema_1.users.email,
                user_user_id: schema_1.users.user_id,
                ui_title: schema_1.uis.title,
                ui_id: schema_1.uis.id,
            })
                .from(schema_1.notifications)
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.notifications.userId))
                .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.notifications.uiId))
                .where((0, drizzle_orm_1.eq)(schema_1.notifications.status, 'PENDING'))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.created_at))
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
        }
        else {
            // For regular users OR Admin viewing personal notifications
            const [totalRes] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userIdInt));
            total = totalRes.value;
            const rows = yield db_1.db
                .select({
                id: schema_1.notifications.id,
                type: schema_1.notifications.type,
                message: schema_1.notifications.message,
                isRead: schema_1.notifications.isRead,
                userId: schema_1.notifications.userId,
                uiId: schema_1.notifications.uiId,
                created_at: schema_1.notifications.created_at,
                ui_title: schema_1.uis.title,
                ui_id: schema_1.uis.id,
            })
                .from(schema_1.notifications)
                .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.notifications.uiId))
                .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userIdInt))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.created_at))
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
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});
exports.getNotifications = getNotifications;
const resolveNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.db.update(schema_1.notifications)
            .set({ status: 'FIXED', isRead: true })
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, id));
        return res.status(200).json({ status: true, message: "Notification marked as FIXED" });
    }
    catch (error) {
        console.error("Error resolving notification:", error);
        res.status(500).json({ error: "Failed to resolve notification" });
    }
});
exports.resolveNotification = resolveNotification;
const dismissNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.db.update(schema_1.notifications)
            .set({ status: 'DISMISSED', isRead: true })
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, id));
        return res.status(200).json({ status: true, message: "Notification marked as DISMISSED" });
    }
    catch (error) {
        console.error("Error dismissing notification:", error);
        res.status(500).json({ error: "Failed to dismiss notification" });
    }
});
exports.dismissNotification = dismissNotification;
