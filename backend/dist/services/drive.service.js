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
exports.deleteFileFromDrive = exports.uploadFileToDrive = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const uploadFileToDrive = (filePath, fileName, mimeType, isPublic) => __awaiter(void 0, void 0, void 0, function* () {
    // OAuth2 Strategy (User Auth)
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
exports.uploadFileToDrive = uploadFileToDrive;
const deleteFileFromDrive = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            console.error("Missing OAuth Credentials for deletion");
            return;
        }
        const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground');
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        yield drive.files.delete({ fileId });
        console.log(`Successfully deleted file from Drive: ${fileId}`);
    }
    catch (error) {
        console.error(`Failed to delete file ${fileId} from Drive:`, error.message);
    }
});
exports.deleteFileFromDrive = deleteFileFromDrive;
