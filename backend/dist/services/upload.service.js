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
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken)
        throw new Error('Missing OAuth Credentials');
    const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground');
    auth.setCredentials({ refresh_token: refreshToken });
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    const created = yield drive.files.create({
        requestBody: {
            name: fileName,
            mimeType: mimeType,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
        media: { mimeType, body: fs_1.default.createReadStream(filePath) },
        fields: 'id, webContentLink, webViewLink',
        supportsAllDrives: true,
    });
    const fileId = created.data.id;
    if (isPublic) {
        yield drive.permissions.create({
            fileId,
            requestBody: { role: 'reader', type: 'anyone' },
        });
    }
    return {
        id: fileId,
        publicUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
        webViewLink: created.data.webViewLink,
    };
});
const processUpload = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, fileName, mimeType, uiId, type, isPublic, showcaseIndex } = data;
    console.log(`📤 Processing Upload: ${type} for UI ${uiId}${typeof showcaseIndex === 'number' ? ` at slot ${showcaseIndex}` : ''}`);
    try {
        if (!fs_1.default.existsSync(filePath))
            throw new Error(`File not found at ${filePath}`);
        const upload = yield uploadFileToDrive(filePath, fileName, mimeType, isPublic);
        if (type === 'BANNER') {
            yield db_1.db.update(schema_1.uis).set({ imageSrc: upload.publicUrl }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'UI_FILE') {
            yield db_1.db.update(schema_1.uis).set({ google_file_id: upload.id }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'SHOWCASE') {
            if (typeof showcaseIndex === 'number') {
                // Edit: replace specific slot
                yield db_1.db.execute((0, drizzle_orm_1.sql) `
                    UPDATE uis
                    SET showcase = JSON_SET(COALESCE(showcase, JSON_ARRAY()), ${`$[${showcaseIndex}]`}, ${upload.publicUrl})
                    WHERE id = ${uiId}
                `);
            }
            else {
                // Add: append
                yield db_1.db.execute((0, drizzle_orm_1.sql) `
                    UPDATE uis
                    SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                    WHERE id = ${uiId}
                `);
            }
        }
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
    catch (error) {
        console.error(`❌ Upload Failed for UI ${uiId} (${type}):`, error.message || error);
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
});
exports.processUpload = processUpload;
