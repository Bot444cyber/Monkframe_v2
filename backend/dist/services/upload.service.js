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
exports.processUpload = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uploadFileToDrive = (filePath, fileName, mimeType, isPublic) => __awaiter(void 0, void 0, void 0, function* () {
    // OAuth2 Strategy
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Missing OAuth Credentials");
    }
    const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground');
    auth.setCredentials({ refresh_token: refreshToken });
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    const media = {
        mimeType: mimeType,
        body: fs_1.default.createReadStream(filePath),
    };
    const created = yield drive.files.create({
        requestBody: {
            name: fileName,
            mimeType: mimeType,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
        media: media,
        fields: 'id, webContentLink, webViewLink, thumbnailLink',
        supportsAllDrives: true,
    });
    const fileId = created.data.id;
    if (isPublic) {
        yield drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
    }
    return {
        id: fileId,
        publicUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
        webViewLink: created.data.webViewLink
    };
});
const processUpload = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, fileName, mimeType, uiId, type, isPublic, userId } = data;
    console.log(`📤 Processing Upload (Sync): ${type} for UI ${uiId}`);
    try {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }
        const upload = yield uploadFileToDrive(filePath, fileName, mimeType, isPublic);
        // Update Database
        if (type === 'BANNER') {
            yield db_1.db.update(schema_1.uis).set({ imageSrc: upload.publicUrl }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'UI_FILE') {
            yield db_1.db.update(schema_1.uis).set({ google_file_id: upload.id }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'SHOWCASE') {
            // MySQL JSON atomic update
            yield db_1.db.execute((0, drizzle_orm_1.sql) `
                UPDATE uis 
                SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                WHERE id = ${uiId}
            `);
        }
        // Clean up
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch (error) {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // Don't throw, just log, so request can finish if using await
    }
});
exports.processUpload = processUpload;
