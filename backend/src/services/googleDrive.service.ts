import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

class GoogleDriveService {
    private drive;
    private folderId: string;

    constructor() {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

        if (!clientId || !clientSecret || !refreshToken) {
            console.error('❌ Google Drive credentials missing in .env');
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            'https://developers.google.com/oauthplayground' // Using the redirect URI from user's .env
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    }

    async listFiles(pageSize: number = 10, pageToken?: string) {
        try {
            const response = await this.drive.files.list({
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
        } catch (error: any) {
            console.error('Error listing Drive files:', error.message);
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    async getStorageUsage() {
        try {
            // Drive API does not provide folder size directly.
            // We list all files in the folder and sum their sizes.
            let totalSize = 0;
            let pageToken: string | undefined = undefined;

            do {
                const response: any = await this.drive.files.list({
                    q: `'${this.folderId}' in parents and trashed = false`,
                    fields: 'nextPageToken, files(size)',
                    pageSize: 1000,
                    pageToken: pageToken
                });

                const files = response.data.files || [];
                files.forEach((file: any) => {
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
        } catch (error: any) {
            console.error('Error calculating storage usage:', error.message);
            throw new Error(`Failed to calculate storage: ${error.message}`);
        }
    }

    private formatBytes(bytes: number, decimals: number = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    async bulkDeleteFiles(fileIds: string[]) {
        try {
            const results = await Promise.allSettled(
                fileIds.map(id => this.drive.files.delete({ fileId: id }))
            );

            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failCount = results.length - successCount;

            return { successCount, failCount };
        } catch (error: any) {
            console.error('Error in bulk deletion:', error.message);
            throw new Error(`Bulk deletion failed: ${error.message}`);
        }
    }

    async uploadFile(fileName: string, mimeType: string, fileStream: any) {
        try {
            const fileMetadata = {
                name: fileName,
                parents: [this.folderId]
            };
            const media = {
                mimeType: mimeType,
                body: fileStream
            };
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink, size, modifiedTime'
            });
            return response.data;
        } catch (error: any) {
            console.error('Error uploading to Drive:', error.message);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(fileId: string) {
        try {
            await this.drive.files.delete({
                fileId: fileId
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error deleting Drive file:', error.message);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async renameFile(fileId: string, newName: string) {
        try {
            const response = await this.drive.files.update({
                fileId: fileId,
                requestBody: {
                    name: newName
                },
                fields: 'id, name'
            });
            return response.data;
        } catch (error: any) {
            console.error('Error renaming Drive file:', error.message);
            throw new Error(`Failed to rename file: ${error.message}`);
        }
    }
}

export default new GoogleDriveService();
