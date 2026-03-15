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
const socket_1 = require("../config/socket");
const queue_1 = require("../config/queue");
const drive_service_1 = require("../services/drive.service");
const helpers_1 = require("../utils/helpers");
const crypto_1 = require("crypto");
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
        const uisRes = yield db_1.db.query.uis.findMany({
            where: whereCondition,
            offset: skip,
            limit: limit,
            orderBy: orderByCondition,
        });
        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        const data = yield Promise.all(uisRes.map((ui) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Get creator manually
            let creator = null;
            if (ui.creatorId) {
                creator = yield db_1.db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.user_id, ui.creatorId),
                    columns: { full_name: true, user_id: true }
                });
            }
            // Get comments count manually
            const commentsResult = yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, ui.id));
            const commentsCount = ((_a = commentsResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            // Get user specific relations manually
            let liked = false;
            let wished = false;
            if (userId) {
                // Check if liked
                const likeResult = yield db_1.db.query.likes.findFirst({
                    where: (likes, { eq, and }) => and(eq(likes.user_id, userId), eq(likes.ui_id, ui.id))
                });
                liked = !!likeResult;
                // Check if wished
                const wishResult = yield db_1.db.query.wishlists.findFirst({
                    where: (wishlists, { eq, and }) => and(eq(wishlists.user_id, userId), eq(wishlists.ui_id, ui.id))
                });
                wished = !!wishResult;
            }
            return Object.assign(Object.assign({}, ui), { creator, imageSrc: (0, helpers_1.transformToProxy)(ui.imageSrc, req), showcase: (ui.showcase && Array.isArray(ui.showcase)) ? ui.showcase.map(url => (0, helpers_1.transformToProxy)(url, req)) : [], liked,
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
        const ui = yield db_1.db.query.uis.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.uis.id, id),
        });
        if (!ui) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }
        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        let creator = null;
        if (ui.creatorId) {
            creator = yield db_1.db.query.users.findFirst({
                where: (users, { eq }) => eq(users.user_id, ui.creatorId),
                columns: { full_name: true, user_id: true }
            });
        }
        const commentsResult = yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.comments).where((0, drizzle_orm_1.eq)(schema_1.comments.ui_id, ui.id));
        const commentsCount = ((_b = commentsResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
        let liked = false;
        let wished = false;
        if (userId) {
            const likeResult = yield db_1.db.query.likes.findFirst({
                where: (likes, { eq, and }) => and(eq(likes.user_id, userId), eq(likes.ui_id, ui.id))
            });
            liked = !!likeResult;
            const wishResult = yield db_1.db.query.wishlists.findFirst({
                where: (wishlists, { eq, and }) => and(eq(wishlists.user_id, userId), eq(wishlists.ui_id, ui.id))
            });
            wished = !!wishResult;
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
        const data = Object.assign(Object.assign({}, ui), { creator, imageSrc: (0, helpers_1.transformToProxy)(ui.imageSrc, req), showcase: (ui.showcase && Array.isArray(ui.showcase)) ? ui.showcase.map(url => (0, helpers_1.transformToProxy)(url, req)) : [], fileSize, // Add file size to response
            liked,
            wished,
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
    try {
        const { id } = req.params;
        const ui = yield db_1.db.query.uis.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.uis.id, id) });
        if (!ui || !ui.google_file_id) {
            return res.status(404).json({ status: false, message: "File not found" });
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
        const fileStream = yield drive.files.get({ fileId: ui.google_file_id, alt: 'media' }, { responseType: 'stream' });
        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${ui.title || 'download'}.zip"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        // Increment Download Counter
        yield db_1.db.update(schema_1.uis).set({ downloads: (0, drizzle_orm_1.sql) `${schema_1.uis.downloads} + 1` }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
        fileStream.data.pipe(res);
    }
    catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ status: false, message: "Download failed or credentials missing" });
    }
});
exports.downloadUI = downloadUI;
// Create new UI
const createUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, price, category, author, color, overview, highlights, rating } = req.body;
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
        // 2. UI File
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            uiFileUpload = (0, drive_service_1.uploadFileToDrive)(file.path, file.originalname, file.mimetype, false);
        }
        // 3. Showcase Images
        if (files && files['showcase']) {
            for (const file of files['showcase']) {
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
        // Parse highlights
        let parsedHighlights = [];
        if (highlights) {
            try {
                parsedHighlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
            }
            catch (e) {
                parsedHighlights = [highlights];
            }
        }
        // Parse specifications
        let parsedSpecifications = [];
        const { specifications } = req.body;
        if (specifications) {
            try {
                parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            }
            catch (e) {
                console.error("Failed to parse specifications", e);
                parsedSpecifications = []; // Fallback
            }
        }
        const generatedId = (0, crypto_1.randomUUID)();
        // Create UI Record with actual URLs
        yield db_1.db.insert(schema_1.uis).values({
            id: generatedId,
            title,
            price: price.toString(),
            category,
            imageSrc: bannerResult ? bannerResult.publicUrl : '', // Use actual URL
            author,
            google_file_id: uiFileResult ? uiFileResult.id : null, // Use actual ID
            color: color || null,
            overview: overview || null,
            highlights: parsedHighlights,
            specifications: parsedSpecifications,
            rating: rating ? parseFloat(rating) : 4.8,
            showcase: showcaseResults.map(res => res.publicUrl), // Use actual URLs
            fileType: (files && files['uiFile'] && files['uiFile'][0]) ? (_b = files['uiFile'][0].originalname.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toUpperCase() : null,
            creatorId: userId
        });
        const newUI = yield db_1.db.query.uis.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.uis.id, generatedId) });
        if (newUI) {
            // Emit initial socket event
            const ioData = Object.assign(Object.assign({}, newUI), { imageSrc: (0, helpers_1.transformToProxy)(newUI.imageSrc, req), showcase: (newUI.showcase && Array.isArray(newUI.showcase)) ? newUI.showcase.map(url => (0, helpers_1.transformToProxy)(url, req)) : [] });
            (0, socket_1.getIO)().emit('ui:new', { ui: ioData });
            res.status(201).json({
                status: true,
                message: "UI Created and files uploaded.",
                data: ioData
            });
        }
        else {
            res.status(500).json({ status: false, message: "Failed to create UI" });
        }
    }
    catch (error) {
        console.error("Create UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to create UI" });
    }
});
exports.createUI = createUI;
// Update UI
const updateUI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { title, price, category, author, overview, highlights, rating } = req.body;
        // Fetch existing UI
        const existingUI = yield db_1.db.query.uis.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.uis.id, id) });
        if (!existingUI) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }
        // Handle Files
        const files = req.files;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Queue Updatable Files
        // 1. Banner
        if (files && files['banner'] && files['banner'][0]) {
            const file = files['banner'][0];
            queue_1.uploadQueue.add({
                filePath: file.path,
                fileName: file.originalname,
                mimeType: file.mimetype,
                uiId: id,
                type: 'BANNER',
                isPublic: true,
                userId
            });
        }
        // 2. UI File
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            queue_1.uploadQueue.add({
                filePath: file.path,
                fileName: file.originalname,
                mimeType: file.mimetype,
                uiId: id,
                type: 'UI_FILE',
                isPublic: false,
                userId
            });
        }
        // 3. Showcase
        if (files && files['showcase']) {
            for (const file of files['showcase']) {
                queue_1.uploadQueue.add({
                    filePath: file.path,
                    fileName: file.originalname,
                    mimeType: file.mimetype,
                    uiId: id,
                    type: 'SHOWCASE',
                    isPublic: true,
                    userId
                });
            }
        }
        // Parse highlights
        let parsedHighlights = undefined;
        if (highlights) {
            try {
                parsedHighlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
            }
            catch (e) {
                parsedHighlights = [highlights];
            }
        }
        // Parse specifications
        let parsedSpecifications = undefined;
        const { specifications } = req.body;
        if (specifications) {
            try {
                parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            }
            catch (e) {
                console.error("Failed to parse specifications update", e);
            }
        }
        // Update Text Fields Immediately
        yield db_1.db.update(schema_1.uis).set(Object.assign({ title: title || undefined, price: price !== undefined ? price.toString() : undefined, category: category || undefined, author: author || undefined, overview: overview || undefined, rating: rating ? parseFloat(rating) : undefined, highlights: parsedHighlights !== undefined ? parsedHighlights : existingUI.highlights, specifications: parsedSpecifications !== undefined ? parsedSpecifications : existingUI.specifications }, (files && files['uiFile'] && files['uiFile'][0] ? {
            fileType: (_b = files['uiFile'][0].originalname.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toUpperCase()
        } : {}))).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
        const updatedUI = yield db_1.db.query.uis.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.uis.id, id) });
        if (updatedUI) {
            // Emit real-time update
            const ioData = Object.assign(Object.assign({}, updatedUI), { imageSrc: (0, helpers_1.transformToProxy)(updatedUI.imageSrc, req), showcase: (updatedUI.showcase && Array.isArray(updatedUI.showcase)) ? updatedUI.showcase.map(url => (0, helpers_1.transformToProxy)(url, req)) : [] });
            (0, socket_1.getIO)().emit('ui:updated', { ui: ioData });
            res.json({
                status: true,
                message: "UI Updated. Files are processing in background.",
                data: ioData
            });
        }
    }
    catch (error) {
        console.error("Update UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to update UI" });
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
        const ui = yield db_1.db.query.uis.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.uis.id, id) });
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
        const showcase = ui.showcase;
        if (showcase && showcase.length > 0) {
            for (const url of showcase) {
                const fileId = extractDriveFileId(url);
                if (fileId) {
                    console.log(`Deleting Showcase Image from Drive: ${fileId}`);
                    yield (0, drive_service_1.deleteFileFromDrive)(fileId);
                }
            }
        }
        // 5. Delete from DB
        yield db_1.db.delete(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, id));
        // Emit real-time event
        (0, socket_1.getIO)().emit('ui:deleted', { id });
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
        // Ensure cache directory exists
        if (!fs_1.default.existsSync(CACHE_DIR)) {
            fs_1.default.mkdirSync(CACHE_DIR, { recursive: true });
        }
        // 1. Browser Caching Headers (Client-side)
        // Cache for 1 year (immutable) since fileIds are unique
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // 2. Server-Side Caching (Disk Cache)
        if (fs_1.default.existsSync(CACHE_FILE)) {
            // Serve from Disk Cache
            const fileStream = fs_1.default.createReadStream(CACHE_FILE);
            fileStream.pipe(res);
            return;
        }
        // If not in cache, fetch from Drive
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
        // Pipe to Response AND Save to Disk Cache
        const dest = fs_1.default.createWriteStream(CACHE_FILE);
        response.data.pipe(dest); // Save to cache
        response.data.pipe(res); // Send to client
        // Handle errors during streaming
        response.data.on('error', (err) => {
            console.error('Error streaming data:', err);
            // Try to clean up partial file
            if (fs_1.default.existsSync(CACHE_FILE))
                fs_1.default.unlinkSync(CACHE_FILE);
        });
    }
    catch (error) {
        console.error("Image Stream Error:", error);
        res.status(404).send("Image not found");
    }
});
exports.streamImage = streamImage;
