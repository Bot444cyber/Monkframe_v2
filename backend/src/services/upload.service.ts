
import { google } from 'googleapis';
import fs from 'fs';
import { db } from '../db';
import { uis } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface UploadJobData {
    filePath: string;
    fileName: string;
    mimeType: string;
    uiId: string;
    type: 'BANNER' | 'UI_FILE' | 'SHOWCASE';
    isPublic: boolean;
    userId?: number;
}

const uploadFileToDrive = async (filePath: string, fileName: string, mimeType: string, isPublic: boolean) => {
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
        process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );
    auth.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth });

    const media = {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
    };

    const created = await drive.files.create({
        requestBody: {
            name: fileName,
            mimeType: mimeType,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        },
        media: media,
        fields: 'id, webContentLink, webViewLink, thumbnailLink',
        supportsAllDrives: true,
    });

    const fileId = created.data.id!;

    if (isPublic) {
        await drive.permissions.create({
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
};

export const processUpload = async (data: UploadJobData) => {
    const { filePath, fileName, mimeType, uiId, type, isPublic, userId } = data;
    console.log(`📤 Processing Upload (Sync): ${type} for UI ${uiId}`);

    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }

        const upload = await uploadFileToDrive(filePath, fileName, mimeType, isPublic);

        // Update Database
        if (type === 'BANNER') {
            await db.update(uis).set({ imageSrc: upload.publicUrl }).where(eq(uis.id, uiId));
        } else if (type === 'UI_FILE') {
            await db.update(uis).set({ google_file_id: upload.id }).where(eq(uis.id, uiId));
        } else if (type === 'SHOWCASE') {
            // MySQL JSON atomic update
            await db.execute(sql`
                UPDATE uis 
                SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                WHERE id = ${uiId}
            `);
        }

        // Clean up
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

    } catch (error: any) {
        console.error(`❌ Upload Failed for UI ${uiId} (${type}):`, error.message || error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        // Don't throw, just log, so request can finish if using await
    }
};
