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
        return __awaiter(this, arguments, void 0, function* (pageSize = 10, pageToken) {
            try {
                const response = yield this.drive.files.list({
                    q: `'${this.folderId}' in parents and trashed = false`,
                    fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
                    orderBy: 'folder, name',
                    pageSize: pageSize,
                    pageToken: pageToken
                });
                return {
                    files: response.data.files,
                    nextPageToken: response.data.nextPageToken
                };
            }
            catch (error) {
                console.error('Error listing Drive files:', error.message);
                throw new Error(`Failed to list files: ${error.message}`);
            }
        });
    }
    getStorageUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Drive API does not provide folder size directly.
                // We list all files in the folder and sum their sizes.
                let totalSize = 0;
                let pageToken = undefined;
                do {
                    const response = yield this.drive.files.list({
                        q: `'${this.folderId}' in parents and trashed = false`,
                        fields: 'nextPageToken, files(size)',
                        pageSize: 1000,
                        pageToken: pageToken
                    });
                    const files = response.data.files || [];
                    files.forEach((file) => {
                        if (file.size) {
                            totalSize += parseInt(file.size);
                        }
                    });
                    pageToken = response.data.nextPageToken;
                } while (pageToken);
                return {
                    totalSizeBytes: totalSize,
                    totalSizeHuman: this.formatBytes(totalSize)
                };
            }
            catch (error) {
                console.error('Error calculating storage usage:', error.message);
                throw new Error(`Failed to calculate storage: ${error.message}`);
            }
        });
    }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    bulkDeleteFiles(fileIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield Promise.allSettled(fileIds.map(id => this.drive.files.delete({ fileId: id })));
                const successCount = results.filter(r => r.status === 'fulfilled').length;
                const failCount = results.length - successCount;
                return { successCount, failCount };
            }
            catch (error) {
                console.error('Error in bulk deletion:', error.message);
                throw new Error(`Bulk deletion failed: ${error.message}`);
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
                    fields: 'id, name, webViewLink, size, modifiedTime'
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
