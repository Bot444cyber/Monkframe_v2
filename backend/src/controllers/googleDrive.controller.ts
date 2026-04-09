import { Request, Response } from 'express';
import googleDriveService from '../services/googleDrive.service';
import stream from 'stream';

export const listFiles = async (req: Request, res: Response) => {
    try {
        const files = await googleDriveService.listFiles();
        res.json({ status: true, data: files });
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
