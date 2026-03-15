import { google } from 'googleapis';
import fs from 'fs';

export const uploadFileToDrive = async (filePath: string, fileName: string, mimeType: string, isPublic: boolean) => {
    // OAuth2 Strategy (User Auth)
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

export const deleteFileFromDrive = async (fileId: string) => {
    try {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            console.error("Missing OAuth Credentials for deletion");
            return;
        }

        const auth = new google.auth.OAuth2(
            clientId,
            clientSecret,
            process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
        );
        auth.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({ version: 'v3', auth });

        await drive.files.delete({ fileId });
        console.log(`Successfully deleted file from Drive: ${fileId}`);
    } catch (error: any) {
        console.error(`Failed to delete file ${fileId} from Drive:`, error.message);
    }
};
