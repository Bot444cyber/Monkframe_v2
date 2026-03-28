import { Request, Response } from 'express';
import { db } from '../db';
import { users, payments, notifications, uis, likes, comments, wishlists } from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { google } from 'googleapis';
import { getStats } from './dashboard.controller'; // Import getStats
import * as fs from 'fs';
import * as path from 'path';

// Helper to extract file ID from Drive URL (reused from ui.controller logic or similar)
const extractDriveFileId = (url: string): string | null => {
    if (!url) return null;
    const idMatch = url.match(/[?&]id=([^&]+)/i);
    if (idMatch && idMatch[1]) return idMatch[1];
    const dMatch = url.match(/\/d\/([^/]+)/);
    if (dMatch && dMatch[1]) return dMatch[1];
    return null;
};

// Helper for debug logging
const logToDebug = (message: string) => {
    const logPath = path.join(__dirname, '../../logs/drive_reset.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    // Ensure directory exists manually — disabled here to avoid Passenger restart loops
    // if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    try {
        fs.appendFileSync(logPath, logMessage);
    } catch (e) {
        console.error("Failed to write to debug log:", e);
    }
};

const deleteFilesFromDrive = async (fileIds: string[]) => {
    if (fileIds.length === 0) return;

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    const msgInit = `[Drive Reset] Initializing deletion for ${fileIds.length} files...`;
    console.log(msgInit);
    logToDebug(msgInit);

    if (!clientId || !clientSecret || !refreshToken) {
        const msgErr = "[Drive Reset] CRITICAL: Missing OAuth Credentials";
        console.error(msgErr);
        logToDebug(msgErr);
        return;
    }

    try {
        const auth = new google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({ version: 'v3', auth });

        const msgAuth = `[Drive Reset] Auth initialized. Starting batch deletion...`;
        console.log(msgAuth);
        logToDebug(msgAuth);

        const batchSize = 5;
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < fileIds.length; i += batchSize) {
            const batch = fileIds.slice(i, i + batchSize);
            const results = await Promise.allSettled(batch.map(id =>
                drive.files.delete({ fileId: id })
            ));

            results.forEach((res, index) => {
                const id = batch[index];
                if (res.status === 'fulfilled') {
                    const msg = `[Drive Reset] Successfully deleted file: ${id}`;
                    console.log(msg);
                    logToDebug(msg);
                    successCount++;
                } else {
                    const msg = `[Drive Reset] Failed to delete file ${id}: ${res.reason?.message || res.reason}`;
                    console.error(msg);
                    logToDebug(msg);
                    failCount++;
                }
            });
        }
        const msgComplete = `[Drive Reset] Completed. Success: ${successCount}, Failed: ${failCount}`;
        console.log(msgComplete);
        logToDebug(msgComplete);
    } catch (error: any) {
        const fatalErr = `[Drive Reset] Fatal Error: ${error.message}`;
        console.error(fatalErr);
        logToDebug(fatalErr);
    }
};

export const getOverviewStats = getStats;

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const usersList = await db.select({
            user_id: users.user_id,
            full_name: users.full_name,
            email: users.email,
            role: users.role,
            status: users.status,
            created_at: users.created_at,
            last_active_at: users.last_active_at
        }).from(users).orderBy(desc(users.created_at));
        res.json({ status: true, data: usersList });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch users" });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role - Must be one of the defined roles in schema
        if (!['ADMIN', 'CUSTOMER', 'EDITOR'].includes(role)) {
            return res.status(400).json({ status: false, message: "Invalid role specified" });
        }

        // Update in database
        await db.update(users)
            .set({ role: role as any })
            .where(eq(users.user_id, parseInt(id)));

        res.json({ status: true, message: `User role updated to ${role} successfully` });
    } catch (error) {
        console.error("Update User Role Error:", error);
        res.status(500).json({ status: false, message: "Failed to update user role" });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status - Must be one of ACTIVE, INACTIVE, SUSPENDED
        if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid status specified" });
        }

        // Update in database
        await db.update(users)
            .set({ status: status as any })
            .where(eq(users.user_id, parseInt(id)));

        res.json({ status: true, message: `User status updated to ${status} successfully` });
    } catch (error) {
        console.error("Update User Status Error:", error);
        res.status(500).json({ status: false, message: "Failed to update user status" });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [totalRes] = await db.select({ value: count() }).from(payments);
        const total = totalRes.value;

        const rows = await db
            .select({
                id: payments.id,
                amount: payments.amount,
                status: payments.status,
                stripePaymentIntentId: payments.stripePaymentIntentId,
                userId: payments.userId,
                uiId: payments.uiId,
                created_at: payments.created_at,
                updated_at: payments.updated_at,
                user_id: users.user_id,
                user_full_name: users.full_name,
                user_email: users.email,
                ui_id: uis.id,
                ui_title: uis.title,
            })
            .from(payments)
            .leftJoin(users, eq(users.user_id, payments.userId))
            .leftJoin(uis, eq(uis.id, payments.uiId))
            .orderBy(desc(payments.created_at))
            .limit(limit)
            .offset(skip);

        const paymentsList = rows.map(r => ({
            id: r.id,
            amount: r.amount,
            status: r.status,
            stripePaymentIntentId: r.stripePaymentIntentId,
            userId: r.userId,
            uiId: r.uiId,
            created_at: r.created_at,
            updated_at: r.updated_at,
            user: r.user_id ? { user_id: r.user_id, full_name: r.user_full_name, email: r.user_email } : null,
            ui: r.ui_id ? { id: r.ui_id, title: r.ui_title } : null,
        }));

        res.json({
            status: true,
            data: paymentsList,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error("Get All Payments Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch payments" });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if payment exists
        const [payment] = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
        if (!payment) {
            return res.status(404).json({ status: false, message: "Payment record not found" });
        }

        // Delete from database
        await db.delete(payments).where(eq(payments.id, id));

        res.json({ status: true, message: "Payment record deleted successfully from dashboard" });
    } catch (error) {
        console.error("Delete Payment Error:", error);
        res.status(500).json({ status: false, message: "Failed to delete payment record" });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const rows = await db
            .select({
                id: notifications.id,
                type: notifications.type,
                message: notifications.message,
                isRead: notifications.isRead,
                userId: notifications.userId,
                uiId: notifications.uiId,
                created_at: notifications.created_at,
                user_full_name: users.full_name,
                ui_title: uis.title,
            })
            .from(notifications)
            .leftJoin(users, eq(users.user_id, notifications.userId))
            .leftJoin(uis, eq(uis.id, notifications.uiId))
            .orderBy(desc(notifications.created_at))
            .limit(50);

        const activity = rows.map(r => ({
            id: r.id,
            type: r.type,
            message: r.message,
            isRead: r.isRead,
            userId: r.userId,
            uiId: r.uiId,
            created_at: r.created_at,
            user: r.user_full_name ? { full_name: r.user_full_name } : null,
            ui: r.ui_title ? { title: r.ui_title } : null,
        }));

        res.json({ status: true, data: activity });
    } catch (error) {
        console.error("Get Recent Activity Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch activity" });
    }
};

export const resetData = async (req: Request, res: Response) => {
    try {
        const requestingUserId = req.user?.user_id;

        // Double check admin role
        if (!requestingUserId) return res.status(403).json({ status: false, message: "Unauthorized" });

        const [user] = await db.select().from(users).where(eq(users.user_id, requestingUserId)).limit(1);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }

        const { options } = req.body;
        const targets = options || {
            uis: true,
            drive: true,
            users: true,
            payments: true,
            social: true,
            notifications: true
        };

        console.log("Starting System Reset with targets:", targets);

        const transactionOperations: any[] = [];

        // 1. Handle Google Drive Files
        if (targets.drive || targets.uis) {
            const allUIs = await db.select({ google_file_id: uis.google_file_id, imageSrc: uis.imageSrc, showcase: uis.showcase }).from(uis);
            let fileIdsToDelete: string[] = [];

            for (const ui of allUIs) {
                if (ui.google_file_id) fileIdsToDelete.push(ui.google_file_id);

                const bannerId = extractDriveFileId(ui.imageSrc);
                if (bannerId) fileIdsToDelete.push(bannerId);

                if (ui.showcase && Array.isArray(ui.showcase)) {
                    (ui.showcase as string[]).forEach((url: string) => {
                        const sId = extractDriveFileId(url);
                        if (sId) fileIdsToDelete.push(sId);
                    });
                }
            }

            fileIdsToDelete = [...new Set(fileIdsToDelete)];

            console.log(`[Drive Reset] Found ${fileIdsToDelete.length} unique file IDs to delete from ${allUIs.length} UIs.`);

            if (fileIdsToDelete.length > 0) {
                await deleteFilesFromDrive(fileIdsToDelete);
            } else {
                console.log("[Drive Reset] No file IDs found to delete.");
            }
        }

        // Add Drizzle Operations mapped to tx
        if (targets.uis) {
            transactionOperations.push((tx: any) => tx.delete(uis));
        }

        if (targets.users) {
            // Wait, we need notEq or we can use SQL for this to keep current user
            transactionOperations.push((tx: any) => tx.execute(`DELETE FROM users WHERE user_id != ${requestingUserId}`));
        }

        if (targets.payments) {
            transactionOperations.push((tx: any) => tx.delete(payments));
        }

        if (targets.social) {
            transactionOperations.push((tx: any) => tx.delete(likes));
            transactionOperations.push((tx: any) => tx.delete(comments));
            transactionOperations.push((tx: any) => tx.delete(wishlists));
        }

        if (targets.notifications) {
            transactionOperations.push((tx: any) => tx.delete(notifications));
        }

        // Execute Transaction
        if (transactionOperations.length > 0) {
            await db.transaction(async (tx) => {
                for (const op of transactionOperations) {
                    await op(tx);
                }
            });
        }

        console.log("System Reset Steps Complete.");

        res.json({ status: true, message: "Selected system data has been reset." });
    } catch (error) {
        console.error("System Reset Error:", error);
        res.status(500).json({ status: false, message: "Failed to reset system data" });
    }
};
