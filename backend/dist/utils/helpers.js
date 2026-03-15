"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToProxy = void 0;
const transformToProxy = (url, req) => {
    if (!url || !url.includes('drive.google.com') || !url.includes('id='))
        return url;
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
        return `${req.protocol}://${req.get('host')}/api/uis/image/${match[1]}`;
    }
    return url;
};
exports.transformToProxy = transformToProxy;
