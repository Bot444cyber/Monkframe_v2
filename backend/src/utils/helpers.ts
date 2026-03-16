import { Request } from 'express';

// Disabling proxy transformation because we now use referrerPolicy="no-referrer"
// on the frontend, which allows direct streaming from Google Drive without
// consuming the backend's bandwidth or causing host header issues.
export const transformToProxy = (url: string, req: Request) => {
    return url;
};