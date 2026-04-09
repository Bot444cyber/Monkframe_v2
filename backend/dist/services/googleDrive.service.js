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
const googleapis_1 = require("googleapis");
class GoogleDriveService {
    constructor() {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
        if (!clientId || !clientSecret || !refreshToken) {
            console.error('❌ Google Drive credentials missing in .env');
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground' // Using the redirect URI from user's .env
        );
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
    }
    listFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.drive.files.list({
                    q: `'${this.folderId}' in parents and trashed = false`,
                    fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
                    orderBy: 'folder, name'
                });
                return response.data.files;
            }
            catch (error) {
                console.error('Error listing Drive files:', error.message);
                throw new Error(`Failed to list files: ${error.message}`);
            }
        });
    }
    uploadFile(fileName, mimeType, fileStream) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileMetadata = {
                    name: fileName,
                    parents: [this.folderId]
                };
                const media = {
                    mimeType: mimeType,
                    body: fileStream
                };
                const response = yield this.drive.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: 'id, name, webViewLink'
                });
                return response.data;
            }
            catch (error) {
                console.error('Error uploading to Drive:', error.message);
                throw new Error(`Failed to upload file: ${error.message}`);
            }
        });
    }
    deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.drive.files.delete({
                    fileId: fileId
                });
                return { success: true };
            }
            catch (error) {
                console.error('Error deleting Drive file:', error.message);
                throw new Error(`Failed to delete file: ${error.message}`);
            }
        });
    }
    renameFile(fileId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.drive.files.update({
                    fileId: fileId,
                    requestBody: {
                        name: newName
                    },
                    fields: 'id, name'
                });
                return response.data;
            }
            catch (error) {
                console.error('Error renaming Drive file:', error.message);
                throw new Error(`Failed to rename file: ${error.message}`);
            }
        });
    }
}
exports.default = new GoogleDriveService();
