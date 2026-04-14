import { Request } from 'express';

// Google Drive raw URLs are blocked by Google for hotlinking. We MUST proxy them.
// Ensure we use 'x-forwarded-host' so Nginx does not trick the server into returning 'localhost' in production.
export const transformToProxy = (url: string, req: Request) => {
    if (!url || !url.includes('drive.google.com') || !url.includes('id=')) return url;

    // Pattern 1: id=FILE_ID (e.g. uc?id=... or open?id=...)
    const match = url.match(/id=([^&]+)/);

    if (match && match[1]) {
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;

        return `${protocol}://${host}/api/uis/image/${match[1]}`;
    }

    return url;
};

export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};


