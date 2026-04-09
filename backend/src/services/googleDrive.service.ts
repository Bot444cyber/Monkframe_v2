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

    async listFiles() {
        try {
            const response = await this.drive.files.list({
                q: `'${this.folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
                orderBy: 'folder, name'
            });
            return response.data.files;
        } catch (error: any) {
            console.error('Error listing Drive files:', error.message);
            throw new Error(`Failed to list files: ${error.message}`);
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
                fields: 'id, name, webViewLink'
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
