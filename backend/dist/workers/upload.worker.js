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
exports.uploadWorker = void 0;
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const drive_service_1 = require("../services/drive.service");
// uploadFileToDrive removed (imported from service)
const uploadWorker = (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, fileName, mimeType, uiId, type, isPublic, userId } = job.data;
    console.log(`📤 Processing Upload Job: ${type} for UI ${uiId}`);
    try {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }
        const upload = yield (0, drive_service_1.uploadFileToDrive)(filePath, fileName, mimeType, isPublic);
        // Update Database
        if (type === 'BANNER') {
            yield db_1.db.update(schema_1.uis).set({ imageSrc: upload.publicUrl }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'UI_FILE') {
            yield db_1.db.update(schema_1.uis).set({ google_file_id: upload.id }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, uiId));
        }
        else if (type === 'SHOWCASE') {
            // Need to append to existing showcase array
            yield db_1.db.execute((0, drizzle_orm_1.sql) `
                UPDATE uis 
                SET showcase = JSON_ARRAY_APPEND(COALESCE(showcase, JSON_ARRAY()), '$', ${upload.publicUrl})
                WHERE id = ${uiId}
            `);
        }
        // Clean up
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        return Promise.resolve();
    }
    catch (error) {
        console.error(`❌ Upload Job Failed:`, error);
        // Clean up even on fail if file exists
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        throw error;
    }
});
exports.uploadWorker = uploadWorker;
