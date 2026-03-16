"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToProxy = void 0;
// Disabling proxy transformation because we now use referrerPolicy="no-referrer"
// on the frontend, which allows direct streaming from Google Drive without
// consuming the backend's bandwidth or causing host header issues.
const transformToProxy = (url, req) => {
    return url;
};
exports.transformToProxy = transformToProxy;
