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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamImage = exports.deleteUI = exports.updateUI = exports.createUI = exports.downloadUI = exports.getUI = exports.getUIs = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload_service_1 = require("../services/upload.service");
const drive_service_1 = require("../services/drive.service");
const helpers_1 = require("../utils/helpers");
const crypto_1 = require("crypto");
const parseArray = (data) => {
    if (!data)
        return [];
    if (Array.isArray(data))
        return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch (_a) {
            return [];
        }
    }
    return [];
};
// Fetch all UIs
const getUIs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        const { creatorId, category, sort } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Default 12 for grid layout
        const skip = (page - 1) * limit;
        const conditions = [];
        if (creatorId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.uis.creatorId, parseInt(creatorId)));
        }
        if (category && category !== 'All') {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.uis.category, category));
        }
        const search = req.query.search;
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.uis.title, `%${search}%`), (0, drizzle_orm_1.like)(schema_1.uis.overview, `%${search}%`), (0, drizzle_orm_1.like)(schema_1.uis.author, `%${search}%`)));
        }
        const whereCondition = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        let orderByCondition = [(0, drizzle_orm_1.desc)(schema_1.uis.created_at)];
        if (sort === 'trending') {
            orderByCondition = [(0, drizzle_orm_1.desc)(schema_1.uis.likes)];
        }
        else if (sort === 'newest') {
            orderByCondition = [(0, drizzle_orm_1.desc)(schema_1.uis.created_at)];
        }
        // Run count and query
        const [totalQuery] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.uis).where(whereCondition);
        const total = totalQuery.value;
        // Fetch UIs
        const uisRes = whereCondition
            ? yield db_1.db.select().from(schema_1.uis).where(whereCondition).orderBy(...orderByCondition).limit(limit).offset(skip)
            : yield db_1.db.select().from(schema_1.uis).orderBy(...orderByCondition).limit(limit).offset(skip);
        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        const data = yield Promise.all(uisRes.map((ui) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Get creator manually
            let creator = null;
            if (ui.creatorId) {
                const [found] = yield db_1.db.select({ full_name: schema_1.users.full_name, user_id: schema_1.users.user_id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, ui.creatorId)).limit(1);
                creator = found !== null && found !== void 0 ? found : null;
            }
            // Get comments count manually
            const commentsResult = yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, ui.id));
            const commentsCount = ((_a = commentsResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            // Get user specific relations manually
            let liked = false;
            let wished = false;
            if (userId) {
                // Check if liked
                const [likeResult] = yield db_1.db.select().from(schema_1.likes).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.likes.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.likes.ui_id, ui.id))).limit(1);
                liked = !!likeResult;
                // Check if wished
                const [wishResult] = yield db_1.db.select().from(schema_1.wishlists).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.wishlists.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.wishlists.ui_id, ui.id))).limit(1);
                wished = !!wishResult;
            }
            return Object.assign(Object.assign({}, ui), { creator, imageSrc: (0, helpers_1.transformToProxy)(ui.imageSrc, req), showcase: parseArray(ui.showcase).map((url) => (0, helpers_1.transformToProxy)(url, req)), specifications: parseArray(ui.specifications), highlights: parseArray(ui.highlights), liked,
                wished,
                commentsCount });
        })));
        res.json({
            status: true,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Error fetching UIs:", error);
        res.status(500).json({ status: false, message: "Failed to fetch UIs" });
    }
});
exports.getUIs = getUIs;
// Get Single UI
const getUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Try to find by slug first, then by ID
        const [ui] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.uis.slug, id), (0, drizzle_orm_1.eq)(schema_1.uis.id, id))).limit(1);
        if (!ui) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }
        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        let creator = null;
        if (ui.creatorId) {
            const [found] = yield db_1.db.select({ full_name: schema_1.users.full_name, user_id: schema_1.users.user_id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, ui.creatorId)).limit(1);
            creator = found !== null && found !== void 0 ? found : null;
        }
        const commentsResult = yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, ui.id));
        const commentsCount = ((_b = commentsResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
        let liked = false;
        let wished = false;
        let purchased = false;
        if (userId) {
            const [likeResult] = yield db_1.db.select().from(schema_1.likes).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.likes.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.likes.ui_id, ui.id))).limit(1);
            liked = !!likeResult;
            const [wishResult] = yield db_1.db.select().from(schema_1.wishlists).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.wishlists.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.wishlists.ui_id, ui.id))).limit(1);
            wished = !!wishResult;
            const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
            const [paymentRecord] = yield db_1.db.select().from(schema_1.payments).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.payments.userId, numericUserId), (0, drizzle_orm_1.eq)(schema_1.payments.uiId, ui.id), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED'))).limit(1);
            const isFree = !ui.price || ui.price === '0' || ui.price.toLowerCase() === 'free';
            if (paymentRecord || ui.creatorId === userId || isFree) {
                purchased = true;
            }
        }
        else {
            // Even if not logged in, we check if it's free for the UI flag
            const isFree = !ui.price || ui.price === '0' || ui.price.toLowerCase() === 'free';
            if (isFree)
                purchased = true;
        }
        // Fetch File Size from Drive if exists
        let fileSize = "Unknown";
        if (ui.google_file_id) {
            try {
                const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
                const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
                const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
                if (clientId && clientSecret && refreshToken) {
                    const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
                    auth.setCredentials({ refresh_token: refreshToken });
                    const drive = googleapis_1.google.drive({ version: 'v3', auth });
                    const fileMeta = yield drive.files.get({
                        fileId: ui.google_file_id,
                        fields: 'size'
                    });
                    if (fileMeta.data.size) {
                        const bytes = parseInt(fileMeta.data.size);
                        if (bytes < 1024 * 1024) {
                            fileSize = (bytes / 1024).toFixed(1) + " KB";
                        }
                        else {
                            fileSize = (bytes / (1024 * 1024)).toFixed(1) + " MB";
                        }
                    }
                }
            }
            catch (err) {
                console.error("Failed to fetch Drive file size:", err);
            }
        }
        const data = Object.assign(Object.assign({}, ui), { creator, imageSrc: (0, helpers_1.transformToProxy)(ui.imageSrc, req), showcase: parseArray(ui.showcase).map((url) => (0, helpers_1.transformToProxy)(url, req)), specifications: parseArray(ui.specifications), highlights: parseArray(ui.highlights), fileSize, // Add file size to response
            liked,
            wished,
            purchased,
            commentsCount });
        res.json({ status: true, data });
    }
    catch (error) {
        console.error("Error fetching UI:", error);
        res.status(500).json({ status: false, message: "Failed to fetch UI" });
    }
});
exports.getUI = getUI;
// Download UI
const downloadUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const [ui] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
        if (!ui || !ui.google_file_id) {
            return res.status(404).json({ status: false, message: "File not found" });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        let canDownload = true; // All users can download
        // The UI requires all users (admin/non-admin) to download without any purchasing
        if (!canDownload) {
            return res.status(403).json({ status: false, message: "You must purchase this asset to download it." });
        }
        // OAuth2 Strategy
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error("Missing OAuth Credentials");
        }
        const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        try {
            const fileStream = yield drive.files.get({ fileId: ui.google_file_id, alt: 'media' }, { responseType: 'stream' });
            // Set headers for download
            res.setHeader('Content-Disposition', `attachment; filename="${ui.title || 'download'}.zip"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            // Increment Download Counter
            yield db_1.db.update(schema_1.uis).set({ downloads: (0, drizzle_orm_1.sql) `${schema_1.uis.downloads} + 1` }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
            fileStream.data.pipe(res);
            // Prevent memory leak: destroy stream if client disconnects
            req.on('close', () => {
                if (!res.writableEnded) {
                    fileStream.data.destroy();
                }
            });
        }
        catch (driveError) {
            // Check for 404 File Not Found
            if (driveError.code === 404 || (driveError.message && driveError.message.includes('File not found'))) {
                console.error(`[CRITICAL] Drive File Missing for UI ${id}: ${ui.google_file_id}`);
                // 1. Notify Admins through the notification system
                try {
                    const adminUsers = yield db_1.db.select({ user_id: schema_1.users.user_id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.role, 'ADMIN'));
                    if (adminUsers.length > 0) {
                        const notificationPromises = adminUsers.map(admin => {
                            return db_1.db.insert(schema_1.notifications).values({
                                id: (0, crypto_1.randomUUID)(),
                                type: 'SYSTEM',
                                message: `⚠️ MISSING ASSET: The file for "${ui.title}" is missing from Google Drive (ID: ${ui.google_file_id}). A user attempted to download it.`,
                                userId: admin.user_id,
                                uiId: id,
                                isRead: false
                            });
                        });
                        yield Promise.all(notificationPromises);
                    }
                }
                catch (notifyErr) {
                    console.error("Failed to create admin notifications:", notifyErr);
                }
                // 2. Respond to the user with a professional message
                return res.status(404).json({
                    status: false,
                    message: "This file is currently unavailable or being moved for maintenance. Our administrators have been notified and it will be restored shortly. Please try again later."
                });
            }
            throw driveError; // Re-throw other errors to be caught by outer catch
        }
    }
    catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ status: false, message: (error === null || error === void 0 ? void 0 : error.message) || "Internal server error during download. Please contact support if the issue persists." });
    }
});
exports.downloadUI = downloadUI;
// Create new UI
const createUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Only title, category, overview (description), author (additional info), customUrl come from form now
        const { title, category, author, overview, customUrl } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Handle Files
        const files = req.files;
        // Prepare Upload Promises
        let bannerUpload = null;
        let uiFileUpload = null;
        const showcaseUploads = [];
        // 1. Banner
        if (files && files['banner'] && files['banner'][0]) {
            const file = files['banner'][0];
            bannerUpload = (0, drive_service_1.uploadFileToDrive)(file.path, file.originalname, file.mimetype, true);
        }
        // 2. UI File (Assets)
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            uiFileUpload = (0, drive_service_1.uploadFileToDrive)(file.path, file.originalname, file.mimetype, false);
        }
        // 3. Showcase Images (up to 4)
        if (files && files['showcase']) {
            for (const file of files['showcase'].slice(0, 4)) {
                showcaseUploads.push((0, drive_service_1.uploadFileToDrive)(file.path, file.originalname, file.mimetype, true));
            }
        }
        // Wait for all uploads
        const [bannerResult, uiFileResult, ...showcaseResults] = yield Promise.all([
            bannerUpload,
            uiFileUpload,
            ...showcaseUploads
        ]);
        // Clean up local files
        if (files) {
            Object.values(files).flat().forEach(file => {
                if (fs_1.default.existsSync(file.path))
                    fs_1.default.unlinkSync(file.path);
            });
        }
        const generatedId = (0, crypto_1.randomUUID)();
        // Create UI Record — removed fields use sensible defaults
        yield db_1.db.insert(schema_1.uis).values({
            id: generatedId,
            title,
            category,
            price: 'Free', // Default: free asset
            author: author || '', // "Additional Information"
            overview: overview || null, // "Description"
            customUrl: customUrl || null,
            imageSrc: bannerResult ? bannerResult.publicUrl : '',
            google_file_id: uiFileResult ? uiFileResult.id : null,
            color: null,
            highlights: [],
            specifications: [],
            rating: 4.8,
            showcase: showcaseResults.map((res) => res.publicUrl),
            fileType: (files && files['uiFile'] && files['uiFile'][0])
                ? (_c = (_b = files['uiFile'][0].originalname.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : null
                : null,
            creatorId: userId,
            slug: (0, helpers_1.slugify)(title)
        });
        const [newUI] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, generatedId)).limit(1);
        if (newUI) {
            const ioData = Object.assign(Object.assign({}, newUI), { imageSrc: (0, helpers_1.transformToProxy)(newUI.imageSrc, req), showcase: parseArray(newUI.showcase).map((url) => (0, helpers_1.transformToProxy)(url, req)), specifications: parseArray(newUI.specifications), highlights: parseArray(newUI.highlights) });
            res.status(201).json({
                status: true,
                message: "Asset created and files uploaded.",
                data: ioData
            });
        }
        else {
            res.status(500).json({ status: false, message: "Failed to create asset" });
        }
    }
    catch (error) {
        console.error("Create UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to create asset" });
    }
});
exports.createUI = createUI;
// Update UI
const updateUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        // New form fields: title, category, overview (description), author (additional info), customUrl
        const { title, category, author, overview, customUrl } = req.body;
        // Fetch existing UI
        const [existingUI] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
        if (!existingUI) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }
        // Handle Files
        const files = req.files;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Queue background file uploads (banner, uiFile, showcase)
        if (files && files['banner'] && files['banner'][0]) {
            const file = files['banner'][0];
            (0, upload_service_1.processUpload)({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'BANNER', isPublic: true, userId });
        }
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            (0, upload_service_1.processUpload)({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'UI_FILE', isPublic: false, userId });
        }
        if (files && files['showcase']) {
            for (const file of files['showcase'].slice(0, 4)) {
                (0, upload_service_1.processUpload)({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'SHOWCASE', isPublic: true, userId });
            }
        }
        // Update only the new form text fields immediately
        yield db_1.db.update(schema_1.uis).set(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title ? { title, slug: (0, helpers_1.slugify)(title) } : {})), (category ? { category } : {})), (author !== undefined ? { author } : {})), (overview !== undefined ? { overview } : {})), (customUrl !== undefined ? { customUrl } : {})), (files && files['uiFile'] && files['uiFile'][0] ? {
            fileType: (_b = files['uiFile'][0].originalname.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toUpperCase()
        } : {}))).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
        const [updatedUI] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
        if (updatedUI) {
            const ioData = Object.assign(Object.assign({}, updatedUI), { imageSrc: (0, helpers_1.transformToProxy)(updatedUI.imageSrc, req), showcase: parseArray(updatedUI.showcase).map((url) => (0, helpers_1.transformToProxy)(url, req)), specifications: parseArray(updatedUI.specifications), highlights: parseArray(updatedUI.highlights) });
            res.json({ status: true, message: "Asset updated. Files processing in background.", data: ioData });
        }
    }
    catch (error) {
        console.error("Update UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to update asset" });
    }
});
exports.updateUI = updateUI;
const extractDriveFileId = (url) => {
    if (!url)
        return null;
    // Pattern 1: id=FILE_ID (e.g. uc?id=... or open?id=...)
    const idMatch = url.match(/[?&]id=([^&]+)/i);
    if (idMatch && idMatch[1])
        return idMatch[1];
    // Pattern 2: /d/FILE_ID (e.g. file/d/.../view)
    const dMatch = url.match(/\/d\/([^/]+)/);
    if (dMatch && dMatch[1])
        return dMatch[1];
    return null;
};
// Delete UI
const deleteUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // 1. Find the UI to get file IDs
        const [ui] = yield db_1.db.select().from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id)).limit(1);
        if (!ui) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }
        // 2. Delete UI File (if exists)
        if (ui.google_file_id) {
            yield (0, drive_service_1.deleteFileFromDrive)(ui.google_file_id);
        }
        // 3. Delete Banner Image (if exists)
        if (ui.imageSrc) {
            const fileId = extractDriveFileId(ui.imageSrc);
            if (fileId) {
                console.log(`Deleting Banner from Drive: ${fileId}`);
                yield (0, drive_service_1.deleteFileFromDrive)(fileId);
            }
        }
        // 4. Delete Showcase Images
        const showcase = parseArray(ui.showcase);
        if (showcase && showcase.length > 0) {
            for (const url of showcase) {
                const fileId = extractDriveFileId(url);
                if (fileId) {
                    console.log(`Deleting Showcase Image from Drive: ${fileId}`);
                    yield (0, drive_service_1.deleteFileFromDrive)(fileId);
                }
            }
        }
        // 5. Delete associated records to prevent orphaned entries
        yield db_1.db.delete(schema_1.wishlists).where((0, drizzle_orm_1.eq)(schema_1.wishlists.ui_id, id));
        yield db_1.db.delete(schema_1.likes).where((0, drizzle_orm_1.eq)(schema_1.likes.ui_id, id));
        yield db_1.db.delete(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, id));
        yield db_1.db.delete(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.uiId, id));
        // 6. Delete from DB
        yield db_1.db.delete(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
        res.json({ status: true, message: "UI and associated Drive files deleted successfully" });
    }
    catch (error) {
        console.error("Delete UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to delete UI" });
    }
});
exports.deleteUI = deleteUI;
// Stream Image Proxy with Caching
const streamImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const CACHE_DIR = path_1.default.join(__dirname, '../../cache');
        const CACHE_FILE = path_1.default.join(CACHE_DIR, `${fileId}`);
        // 1. Browser Caching Headers (Client-side)
        // Cache for 1 year (immutable) since fileIds are unique
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // Fetch from Drive
        // OAuth2 Strategy
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error("Missing OAuth Credentials");
        }
        const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        // Fetch stream
        const response = yield drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
        // Transfer essential headers from Google to avoid browser "nosniff" blocking
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        // Pipe directly to client Response
        response.data.pipe(res);
        // Prevent memory leak: destroy stream if client disconnects
        req.on('close', () => {
            if (!res.writableEnded) {
                response.data.destroy();
            }
        });
        // Handle errors during streaming
        response.data.on('error', (err) => {
            console.error('Error streaming data:', err);
        });
    }
    catch (error) {
        console.error("Image Stream Error:", error);
        res.status(404).send("Image not found");
    }
});
exports.streamImage = streamImage;
