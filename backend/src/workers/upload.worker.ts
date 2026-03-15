
import { Job } from 'bull';
import { google } from 'googleapis';
import fs from 'fs';
import { db } from '../db';
import { uis } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { getIO } from '../config/socket';

interface UploadJobData {
    filePath: string;
    fileName: string;
    mimeType: string;
    uiId: string;
    type: 'BANNER' | 'UI_FILE' | 'SHOWCASE';
    isPublic: boolean;
    userId?: number;
}

import { uploadFileToDrive } from '../services/drive.service';

// uploadFileToDrive removed (imported from service)

export const uploadWorker = async (job: Job<UploadJobData>) => {
    const { filePath, fileName, mimeType, uiId, type, isPublic, userId } = job.data;
    console.log(`📤 Processing Upload Job: ${type} for UI ${uiId}`);

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
            // Need to append to existing showcase array
            await db.execute(sql`
                UPDATE uis 
                SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                WHERE id = ${uiId}
            `);
        }

        // Notify User/Frontend
        const io = getIO();

        // Emit general update
        if (userId) {
            io.to(userId.toString()).emit('upload:complete', {
                uiId,
                type,
                status: 'success',
                url: upload.publicUrl
            });
        }

        // Clean up
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return Promise.resolve();

    } catch (error: any) {
        console.error(`❌ Upload Job Failed:`, error);
        // Clean up even on fail if file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Notify Error
        const io = getIO();
        if (userId) {
            io.to(userId.toString()).emit('upload:error', {
                uiId,
                type,
                message: error.message
            });
        }

        throw error;
    }
};
