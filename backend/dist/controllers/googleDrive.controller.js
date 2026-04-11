"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.deleteFile = exports.uploadFile = exports.bulkDelete = exports.getStorageUsage = exports.listFiles = void 0;
const googleDrive_service_1 = __importDefault(require("../services/googleDrive.service"));
const stream_1 = __importDefault(require("stream"));
const listFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pageToken = req.query.pageToken;
        const result = yield googleDrive_service_1.default.listFiles(pageSize, pageToken);
        res.json({ status: true, data: result.files, nextPageToken: result.nextPageToken });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.listFiles = listFiles;
const getStorageUsage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usage = yield googleDrive_service_1.default.getStorageUsage();
        res.json({ status: true, data: usage });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.getStorageUsage = getStorageUsage;
const bulkDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileIds } = req.body;
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({ status: false, message: 'Invalid or empty fileIds' });
        }
        const result = yield googleDrive_service_1.default.bulkDeleteFiles(fileIds);
        res.json({
            status: true,
            message: `Deleted ${result.successCount} files. ${result.failCount} failed.`,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.bulkDelete = bulkDelete;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        const bufferStream = new stream_1.default.PassThrough();
        bufferStream.end(req.file.buffer);
        const file = yield googleDrive_service_1.default.uploadFile(req.file.originalname, req.file.mimetype, bufferStream);
        res.json({ status: true, data: file, message: 'File uploaded successfully' });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield googleDrive_service_1.default.deleteFile(id);
        res.json({ status: true, message: 'File deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.deleteFile = deleteFile;
const renameFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: false, message: 'New name is required' });
        }
        const file = yield googleDrive_service_1.default.renameFile(id, name);
        res.json({ status: true, data: file, message: 'File renamed successfully' });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
exports.renameFile = renameFile;
