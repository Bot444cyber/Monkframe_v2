import { Request, Response } from 'express';
import { db } from '../db';
import { uis, comments as commentsTable, users, likes, wishlists, payments } from '../db/schema';
import { eq, and, or, like, desc, count, sql } from 'drizzle-orm';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { processUpload } from '../services/upload.service';
import { uploadFileToDrive, deleteFileFromDrive } from '../services/drive.service';
import { transformToProxy } from '../utils/helpers';
import { randomUUID } from 'crypto';

const parseArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
};

// Fetch all UIs
export const getUIs = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        const { creatorId, category, sort } = req.query;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12; // Default 12 for grid layout
        const skip = (page - 1) * limit;

        const conditions = [];
        if (creatorId) {
            conditions.push(eq(uis.creatorId, parseInt(creatorId as string)));
        }
        if (category && category !== 'All') {
            conditions.push(eq(uis.category, category as string));
        }

        const search = req.query.search as string;
        if (search) {
            conditions.push(
                or(
                    like(uis.title, `%${search}%`),
                    like(uis.overview, `%${search}%`),
                    like(uis.author, `%${search}%`)
                )
            );
        }

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        let orderByCondition: any = [desc(uis.created_at)];
        if (sort === 'trending') {
            orderByCondition = [desc(uis.likes)];
        } else if (sort === 'newest') {
            orderByCondition = [desc(uis.created_at)];
        }

        // Run count and query
        const [totalQuery] = await db.select({ value: count() }).from(uis).where(whereCondition);
        const total = totalQuery.value;

        // Fetch UIs
        const uisRes = whereCondition
            ? await db.select().from(uis).where(whereCondition).orderBy(...orderByCondition).limit(limit).offset(skip)
            : await db.select().from(uis).orderBy(...orderByCondition).limit(limit).offset(skip);

        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        const data = await Promise.all(uisRes.map(async (ui: any) => {
            // Get creator manually
            let creator = null;
            if (ui.creatorId) {
                const [found] = await db.select({ full_name: users.full_name, user_id: users.user_id }).from(users).where(eq(users.user_id, ui.creatorId)).limit(1);
                creator = found ?? null;
            }

            // Get comments count manually
            const commentsResult = await db.select({ count: count() }).from(commentsTable).where(eq(commentsTable.ui_id, ui.id));
            const commentsCount = commentsResult[0]?.count || 0;

            // Get user specific relations manually
            let liked = false;
            let wished = false;

            if (userId) {
                // Check if liked
                const [likeResult] = await db.select().from(likes).where(and(eq(likes.user_id, userId), eq(likes.ui_id, ui.id))).limit(1);
                liked = !!likeResult;

                // Check if wished
                const [wishResult] = await db.select().from(wishlists).where(and(eq(wishlists.user_id, userId), eq(wishlists.ui_id, ui.id))).limit(1);
                wished = !!wishResult;
            }

            return {
                ...ui,
                creator,
                imageSrc: transformToProxy(ui.imageSrc, req),
                showcase: parseArray(ui.showcase).map((url: string) => transformToProxy(url, req)),
                specifications: parseArray(ui.specifications),
                highlights: parseArray(ui.highlights),
                liked,
                wished,
                commentsCount,
            };
        }));

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
    } catch (error) {
        console.error("Error fetching UIs:", error);
        res.status(500).json({ status: false, message: "Failed to fetch UIs" });
    }
};

// Get Single UI
export const getUI = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        const [ui] = await db.select().from(uis).where(eq(uis.id, id)).limit(1);

        if (!ui) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }

        // Fetch relations manually to bypass MariaDB subquery scoping bugs
        let creator = null;
        if (ui.creatorId) {
            const [found] = await db.select({ full_name: users.full_name, user_id: users.user_id }).from(users).where(eq(users.user_id, ui.creatorId!)).limit(1);
            creator = found ?? null;
        }

        const commentsResult = await db.select({ count: count() }).from(commentsTable).where(eq(commentsTable.ui_id, ui.id));
        const commentsCount = commentsResult[0]?.count || 0;

        let liked = false;
        let wished = false;
        let purchased = false;

        if (userId) {
            const [likeResult] = await db.select().from(likes).where(and(eq(likes.user_id, userId), eq(likes.ui_id, ui.id))).limit(1);
            liked = !!likeResult;

            const [wishResult] = await db.select().from(wishlists).where(and(eq(wishlists.user_id, userId), eq(wishlists.ui_id, ui.id))).limit(1);
            wished = !!wishResult;

            const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
            const [paymentRecord] = await db.select().from(payments).where(and(eq(payments.userId, numericUserId), eq(payments.uiId, ui.id), eq(payments.status, 'COMPLETED'))).limit(1);

            const isFree = !ui.price || ui.price === '0' || ui.price.toLowerCase() === 'free';
            if (paymentRecord || ui.creatorId === userId || isFree) {
                purchased = true;
            }
        } else {
            // Even if not logged in, we check if it's free for the UI flag
            const isFree = !ui.price || ui.price === '0' || ui.price.toLowerCase() === 'free';
            if (isFree) purchased = true;
        }

        // Fetch File Size from Drive if exists
        let fileSize = "Unknown";
        if (ui.google_file_id) {
            try {
                const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
                const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
                const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

                if (clientId && clientSecret && refreshToken) {
                    const auth = new google.auth.OAuth2(
                        clientId,
                        clientSecret,
                        'https://developers.google.com/oauthplayground'
                    );
                    auth.setCredentials({ refresh_token: refreshToken });
                    const drive = google.drive({ version: 'v3', auth });

                    const fileMeta = await drive.files.get({
                        fileId: ui.google_file_id,
                        fields: 'size'
                    });

                    if (fileMeta.data.size) {
                        const bytes = parseInt(fileMeta.data.size);
                        if (bytes < 1024 * 1024) {
                            fileSize = (bytes / 1024).toFixed(1) + " KB";
                        } else {
                            fileSize = (bytes / (1024 * 1024)).toFixed(1) + " MB";
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Drive file size:", err);
            }
        }

        const data = {
            ...ui,
            creator,
            imageSrc: transformToProxy(ui.imageSrc, req),
            showcase: parseArray(ui.showcase).map((url: string) => transformToProxy(url, req)),
            specifications: parseArray(ui.specifications),
            highlights: parseArray(ui.highlights),
            fileSize, // Add file size to response
            liked,
            wished,
            purchased,
            commentsCount,
        };

        res.json({ status: true, data });
    } catch (error) {
        console.error("Error fetching UI:", error);
        res.status(500).json({ status: false, message: "Failed to fetch UI" });
    }
};

// Download UI
export const downloadUI = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [ui] = await db.select().from(uis).where(eq(uis.id, id)).limit(1);

        if (!ui || !ui.google_file_id) {
            return res.status(404).json({ status: false, message: "File not found" });
        }

        const userId = req.user?.user_id;
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

        const auth = new google.auth.OAuth2(
            clientId,
            clientSecret,
            'https://developers.google.com/oauthplayground'
        );
        auth.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({ version: 'v3', auth });

        const fileStream = await drive.files.get(
            { fileId: ui.google_file_id, alt: 'media' },
            { responseType: 'stream' }
        );

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${ui.title || 'download'}.zip"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Increment Download Counter
        await db.update(uis).set({ downloads: sql`${uis.downloads} + 1` }).where(eq(uis.id, id));

        fileStream.data.pipe(res);

        // Prevent memory leak: destroy stream if client disconnects
        req.on('close', () => {
            if (!res.writableEnded) {
                fileStream.data.destroy();
            }
        });

    } catch (error: any) {
        console.error("Download Error:", error);
        res.status(500).json({ status: false, message: error?.message || "Google Drive integration failed or credentials missing. Check backend logs." });
    }
};

// Create new UI
export const createUI = async (req: Request, res: Response) => {
    try {
        // Only title, category, overview (description), author (additional info) come from form now
        const { title, category, author, overview } = req.body;
        const userId = (req.user as any)?.user_id;

        // Handle Files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // Prepare Upload Promises
        let bannerUpload: Promise<any> | null = null;
        let uiFileUpload: Promise<any> | null = null;
        const showcaseUploads: Promise<any>[] = [];

        // 1. Banner
        if (files && files['banner'] && files['banner'][0]) {
            const file = files['banner'][0];
            bannerUpload = uploadFileToDrive(file.path, file.originalname, file.mimetype, true);
        }

        // 2. UI File (Assets)
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            uiFileUpload = uploadFileToDrive(file.path, file.originalname, file.mimetype, false);
        }

        // 3. Showcase Images (up to 4)
        if (files && files['showcase']) {
            for (const file of files['showcase'].slice(0, 4)) {
                showcaseUploads.push(uploadFileToDrive(file.path, file.originalname, file.mimetype, true));
            }
        }

        // Wait for all uploads
        const [bannerResult, uiFileResult, ...showcaseResults] = await Promise.all([
            bannerUpload,
            uiFileUpload,
            ...showcaseUploads
        ]);

        // Clean up local files
        if (files) {
            Object.values(files).flat().forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        const generatedId = randomUUID();

        // Create UI Record — removed fields use sensible defaults
        await db.insert(uis).values({
            id: generatedId,
            title,
            category,
            price: 'Free',                                   // Default: free asset
            author: author || '',                            // "Additional Information"
            overview: overview || null,                      // "Description"
            imageSrc: bannerResult ? bannerResult.publicUrl : '',
            google_file_id: uiFileResult ? uiFileResult.id : null,
            color: null,
            highlights: [],
            specifications: [],
            rating: 4.8,
            showcase: showcaseResults.map((res: any) => res.publicUrl),
            fileType: (files && files['uiFile'] && files['uiFile'][0])
                ? files['uiFile'][0].originalname.split('.').pop()?.toUpperCase() ?? null
                : null,
            creatorId: userId
        });

        const [newUI] = await db.select().from(uis).where(eq(uis.id, generatedId)).limit(1);

        if (newUI) {
            const ioData = {
                ...newUI,
                imageSrc: transformToProxy(newUI.imageSrc, req),
                showcase: parseArray(newUI.showcase).map((url: string) => transformToProxy(url, req)),
                specifications: parseArray(newUI.specifications),
                highlights: parseArray(newUI.highlights)
            };

            res.status(201).json({
                status: true,
                message: "Asset created and files uploaded.",
                data: ioData
            });
        } else {
            res.status(500).json({ status: false, message: "Failed to create asset" });
        }

    } catch (error) {
        console.error("Create UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to create asset" });
    }
};


// Update UI
export const updateUI = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // New form fields: title, category, overview (description), author (additional info)
        const { title, category, author, overview } = req.body;

        // Fetch existing UI
        const [existingUI] = await db.select().from(uis).where(eq(uis.id, id)).limit(1);
        if (!existingUI) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }

        // Handle Files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const userId = (req.user as any)?.user_id;

        // Queue background file uploads (banner, uiFile, showcase)
        if (files && files['banner'] && files['banner'][0]) {
            const file = files['banner'][0];
            processUpload({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'BANNER', isPublic: true, userId });
        }
        if (files && files['uiFile'] && files['uiFile'][0]) {
            const file = files['uiFile'][0];
            processUpload({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'UI_FILE', isPublic: false, userId });
        }
        if (files && files['showcase']) {
            for (const file of files['showcase'].slice(0, 4)) {
                processUpload({ filePath: file.path, fileName: file.originalname, mimeType: file.mimetype, uiId: id, type: 'SHOWCASE', isPublic: true, userId });
            }
        }

        // Update only the new form text fields immediately
        await db.update(uis).set({
            ...(title ? { title } : {}),
            ...(category ? { category } : {}),
            ...(author !== undefined ? { author } : {}),
            ...(overview !== undefined ? { overview } : {}),
            ...(files && files['uiFile'] && files['uiFile'][0] ? {
                fileType: files['uiFile'][0].originalname.split('.').pop()?.toUpperCase()
            } : {})
        }).where(eq(uis.id, id));

        const [updatedUI] = await db.select().from(uis).where(eq(uis.id, id)).limit(1);

        if (updatedUI) {
            const ioData = {
                ...updatedUI,
                imageSrc: transformToProxy(updatedUI.imageSrc, req),
                showcase: parseArray(updatedUI.showcase).map((url: string) => transformToProxy(url, req)),
                specifications: parseArray(updatedUI.specifications),
                highlights: parseArray(updatedUI.highlights)
            };
            res.json({ status: true, message: "Asset updated. Files processing in background.", data: ioData });
        }

    } catch (error) {
        console.error("Update UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to update asset" });
    }
};


const extractDriveFileId = (url: string): string | null => {
    if (!url) return null;

    // Pattern 1: id=FILE_ID (e.g. uc?id=... or open?id=...)
    const idMatch = url.match(/[?&]id=([^&]+)/i);
    if (idMatch && idMatch[1]) return idMatch[1];

    // Pattern 2: /d/FILE_ID (e.g. file/d/.../view)
    const dMatch = url.match(/\/d\/([^/]+)/);
    if (dMatch && dMatch[1]) return dMatch[1];

    return null;
};

// Delete UI
export const deleteUI = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Find the UI to get file IDs
        const [ui] = await db.select().from(uis).where(eq(uis.id, id)).limit(1);

        if (!ui) {
            return res.status(404).json({ status: false, message: "UI not found" });
        }

        // 2. Delete UI File (if exists)
        if (ui.google_file_id) {
            await deleteFileFromDrive(ui.google_file_id);
        }

        // 3. Delete Banner Image (if exists)
        if (ui.imageSrc) {
            const fileId = extractDriveFileId(ui.imageSrc);
            if (fileId) {
                console.log(`Deleting Banner from Drive: ${fileId}`);
                await deleteFileFromDrive(fileId);
            }
        }

        // 4. Delete Showcase Images
        const showcase = ui.showcase as string[];
        if (showcase && showcase.length > 0) {
            for (const url of showcase) {
                const fileId = extractDriveFileId(url);
                if (fileId) {
                    console.log(`Deleting Showcase Image from Drive: ${fileId}`);
                    await deleteFileFromDrive(fileId);
                }
            }
        }

        // 5. Delete from DB
        await db.delete(uis).where(eq(uis.id, id));

        res.json({ status: true, message: "UI and associated Drive files deleted successfully" });
    } catch (error) {
        console.error("Delete UI Error:", error);
        res.status(500).json({ status: false, message: "Failed to delete UI" });
    }
};

// Stream Image Proxy with Caching
export const streamImage = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        const CACHE_DIR = path.join(__dirname, '../../cache');
        const CACHE_FILE = path.join(CACHE_DIR, `${fileId}`);

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

        const auth = new google.auth.OAuth2(
            clientId,
            clientSecret,
            'https://developers.google.com/oauthplayground'
        );
        auth.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({ version: 'v3', auth });

        // Fetch stream
        const response = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        // Transfer essential headers from Google to avoid browser "nosniff" blocking
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type'] as string);
        }
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length'] as string);
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

    } catch (error) {
        console.error("Image Stream Error:", error);
        res.status(404).send("Image not found");
    }
};
