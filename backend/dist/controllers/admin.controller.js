"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.resetData = exports.getRecentActivity = exports.getAllPayments = exports.getAllUsers = exports.getOverviewStats = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const googleapis_1 = require("googleapis");
const dashboard_controller_1 = require("./dashboard.controller"); // Import getStats
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Helper to extract file ID from Drive URL (reused from ui.controller logic or similar)
const extractDriveFileId = (url) => {
    if (!url)
        return null;
    const idMatch = url.match(/[?&]id=([^&]+)/i);
    if (idMatch && idMatch[1])
        return idMatch[1];
    const dMatch = url.match(/\/d\/([^/]+)/);
    if (dMatch && dMatch[1])
        return dMatch[1];
    return null;
};
// Helper for debug logging
const logToDebug = (message) => {
    const logPath = path.join(__dirname, '../../logs/drive_reset.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    // Ensure directory exists
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    try {
        fs.appendFileSync(logPath, logMessage);
    }
    catch (e) {
        console.error("Failed to write to debug log:", e);
    }
};
const deleteFilesFromDrive = (fileIds) => __awaiter(void 0, void 0, void 0, function* () {
    if (fileIds.length === 0)
        return;
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
        const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const msgAuth = `[Drive Reset] Auth initialized. Starting batch deletion...`;
        console.log(msgAuth);
        logToDebug(msgAuth);
        const batchSize = 5;
        let successCount = 0;
        let failCount = 0;
        for (let i = 0; i < fileIds.length; i += batchSize) {
            const batch = fileIds.slice(i, i + batchSize);
            const results = yield Promise.allSettled(batch.map(id => drive.files.delete({ fileId: id })));
            results.forEach((res, index) => {
                var _a;
                const id = batch[index];
                if (res.status === 'fulfilled') {
                    const msg = `[Drive Reset] Successfully deleted file: ${id}`;
                    console.log(msg);
                    logToDebug(msg);
                    successCount++;
                }
                else {
                    const msg = `[Drive Reset] Failed to delete file ${id}: ${((_a = res.reason) === null || _a === void 0 ? void 0 : _a.message) || res.reason}`;
                    console.error(msg);
                    logToDebug(msg);
                    failCount++;
                }
            });
        }
        const msgComplete = `[Drive Reset] Completed. Success: ${successCount}, Failed: ${failCount}`;
        console.log(msgComplete);
        logToDebug(msgComplete);
    }
    catch (error) {
        const fatalErr = `[Drive Reset] Fatal Error: ${error.message}`;
        console.error(fatalErr);
        logToDebug(fatalErr);
    }
});
exports.getOverviewStats = dashboard_controller_1.getStats;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield db_1.db.select({
            user_id: schema_1.users.user_id,
            full_name: schema_1.users.full_name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            status: schema_1.users.status,
            created_at: schema_1.users.created_at
        }).from(schema_1.users).orderBy((0, drizzle_orm_1.desc)(schema_1.users.created_at));
        res.json({ status: true, data: usersList });
    }
    catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [totalRes] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.payments);
        const total = totalRes.value;
        const rows = yield db_1.db
            .select({
            id: schema_1.payments.id,
            amount: schema_1.payments.amount,
            status: schema_1.payments.status,
            stripePaymentIntentId: schema_1.payments.stripePaymentIntentId,
            userId: schema_1.payments.userId,
            uiId: schema_1.payments.uiId,
            created_at: schema_1.payments.created_at,
            updated_at: schema_1.payments.updated_at,
            user_id: schema_1.users.user_id,
            user_full_name: schema_1.users.full_name,
            user_email: schema_1.users.email,
            ui_id: schema_1.uis.id,
            ui_title: schema_1.uis.title,
        })
            .from(schema_1.payments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.payments.userId))
            .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.payments.uiId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.payments.created_at))
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
    }
    catch (error) {
        console.error("Get All Payments Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch payments" });
    }
});
exports.getAllPayments = getAllPayments;
const getRecentActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield db_1.db
            .select({
            id: schema_1.notifications.id,
            type: schema_1.notifications.type,
            message: schema_1.notifications.message,
            isRead: schema_1.notifications.isRead,
            userId: schema_1.notifications.userId,
            uiId: schema_1.notifications.uiId,
            created_at: schema_1.notifications.created_at,
            user_full_name: schema_1.users.full_name,
            ui_title: schema_1.uis.title,
        })
            .from(schema_1.notifications)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.notifications.userId))
            .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.notifications.uiId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.created_at))
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
    }
    catch (error) {
        console.error("Get Recent Activity Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch activity" });
    }
});
exports.getRecentActivity = getRecentActivity;
const resetData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestingUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Double check admin role
        if (!requestingUserId)
            return res.status(403).json({ status: false, message: "Unauthorized" });
        const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, requestingUserId)).limit(1);
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
        const transactionOperations = [];
        // 1. Handle Google Drive Files
        if (targets.drive || targets.uis) {
            const allUIs = yield db_1.db.select({ google_file_id: schema_1.uis.google_file_id, imageSrc: schema_1.uis.imageSrc, showcase: schema_1.uis.showcase }).from(schema_1.uis);
            let fileIdsToDelete = [];
            for (const ui of allUIs) {
                if (ui.google_file_id)
                    fileIdsToDelete.push(ui.google_file_id);
                const bannerId = extractDriveFileId(ui.imageSrc);
                if (bannerId)
                    fileIdsToDelete.push(bannerId);
                if (ui.showcase && Array.isArray(ui.showcase)) {
                    ui.showcase.forEach((url) => {
                        const sId = extractDriveFileId(url);
                        if (sId)
                            fileIdsToDelete.push(sId);
                    });
                }
            }
            fileIdsToDelete = [...new Set(fileIdsToDelete)];
            console.log(`[Drive Reset] Found ${fileIdsToDelete.length} unique file IDs to delete from ${allUIs.length} UIs.`);
            if (fileIdsToDelete.length > 0) {
                yield deleteFilesFromDrive(fileIdsToDelete);
            }
            else {
                console.log("[Drive Reset] No file IDs found to delete.");
            }
        }
        // Add Drizzle Operations mapped to tx
        if (targets.uis) {
            transactionOperations.push((tx) => tx.delete(schema_1.uis));
        }
        if (targets.users) {
            // Wait, we need notEq or we can use SQL for this to keep current user
            transactionOperations.push((tx) => tx.execute(`DELETE FROM users WHERE user_id != ${requestingUserId}`));
        }
        if (targets.payments) {
            transactionOperations.push((tx) => tx.delete(schema_1.payments));
        }
        if (targets.social) {
            transactionOperations.push((tx) => tx.delete(schema_1.likes));
            transactionOperations.push((tx) => tx.delete(schema_1.comments));
            transactionOperations.push((tx) => tx.delete(schema_1.wishlists));
        }
        if (targets.notifications) {
            transactionOperations.push((tx) => tx.delete(schema_1.notifications));
        }
        // Execute Transaction
        if (transactionOperations.length > 0) {
            yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                for (const op of transactionOperations) {
                    yield op(tx);
                }
            }));
        }
        console.log("System Reset Steps Complete.");
        res.json({ status: true, message: "Selected system data has been reset." });
    }
    catch (error) {
        console.error("System Reset Error:", error);
        res.status(500).json({ status: false, message: "Failed to reset system data" });
    }
});
exports.resetData = resetData;
