import { Request, Response } from 'express';
import googleDriveService from '../services/googleDrive.service';
import stream from 'stream';

export const listFiles = async (req: Request, res: Response) => {
    try {
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const pageToken = req.query.pageToken as string;

        const result = await googleDriveService.listFiles(pageSize, pageToken);
        res.json({ status: true, data: result.files, nextPageToken: result.nextPageToken });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getStorageUsage = async (req: Request, res: Response) => {
    try {
        const usage = await googleDriveService.getStorageUsage();
        res.json({ status: true, data: usage });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const bulkDelete = async (req: Request, res: Response) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({ status: false, message: 'Invalid or empty fileIds' });
        }

        const result = await googleDriveService.bulkDeleteFiles(fileIds);
        res.json({
            status: true,
            message: `Deleted ${result.successCount} files. ${result.failCount} failed.`,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        const file = await googleDriveService.uploadFile(
            req.file.originalname,
            req.file.mimetype,
            bufferStream
        );

        res.json({ status: true, data: file, message: 'File uploaded successfully' });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await googleDriveService.deleteFile(id);
        res.json({ status: true, message: 'File deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const renameFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: 'New name is required' });
        }

        const file = await googleDriveService.renameFile(id, name);
        res.json({ status: true, data: file, message: 'File renamed successfully' });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};
