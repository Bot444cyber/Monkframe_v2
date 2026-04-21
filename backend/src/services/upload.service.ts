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
    /** Edit mode only: replace showcase at this index instead of appending */
    showcaseIndex?: number;
}

const uploadFileToDrive = async (filePath: string, fileName: string, mimeType: string, isPublic: boolean) => {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) throw new Error('Missing OAuth Credentials');

    const auth = new google.auth.OAuth2(
        clientId, clientSecret,
        process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );
    auth.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: 'v3', auth });

    const created = await drive.files.create({
        requestBody: {
            name: fileName,
            mimeType: mimeType,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        },
        media: { mimeType, body: fs.createReadStream(filePath) },
        fields: 'id, webContentLink, webViewLink',
        supportsAllDrives: true,
    });

    const fileId = created.data.id!;
    if (isPublic) {
        await drive.permissions.create({
            fileId,
            requestBody: { role: 'reader', type: 'anyone' },
        });
    }

    return {
        id: fileId,
        publicUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
        webViewLink: created.data.webViewLink,
    };
};

export const processUpload = async (data: UploadJobData) => {
    const { filePath, fileName, mimeType, uiId, type, isPublic, showcaseIndex } = data;
    console.log(`📤 Processing Upload: ${type} for UI ${uiId}${typeof showcaseIndex === 'number' ? ` at slot ${showcaseIndex}` : ''}`);

    try {
        if (!fs.existsSync(filePath)) throw new Error(`File not found at ${filePath}`);

        const upload = await uploadFileToDrive(filePath, fileName, mimeType, isPublic);

        if (type === 'BANNER') {
            await db.update(uis).set({ imageSrc: upload.publicUrl }).where(eq(uis.id, uiId));

        } else if (type === 'UI_FILE') {
            await db.update(uis).set({ google_file_id: upload.id }).where(eq(uis.id, uiId));

        } else if (type === 'SHOWCASE') {
            if (typeof showcaseIndex === 'number') {
                // Edit: replace specific slot
                await db.execute(sql`
                    UPDATE uis
                    SET showcase = JSON_SET(COALESCE(showcase, JSON_ARRAY()), ${`$[${showcaseIndex}]`}, ${upload.publicUrl})
                    WHERE id = ${uiId}
                `);
            } else {
                // Add: append
                await db.execute(sql`
                    UPDATE uis
                    SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                    WHERE id = ${uiId}
                `);
            }
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (error: any) {
        console.error(`❌ Upload Failed for UI ${uiId} (${type}):`, error.message || error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
};
