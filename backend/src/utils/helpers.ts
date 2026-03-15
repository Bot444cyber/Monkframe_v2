import { Request } from 'express';

export const transformToProxy = (url: string, req: Request) => {
    if (!url || !url.includes('drive.google.com') || !url.includes('id=')) return url;
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
        return `${req.protocol}://${req.get('host')}/api/uis/image/${match[1]}`;
    }
    return url;
};