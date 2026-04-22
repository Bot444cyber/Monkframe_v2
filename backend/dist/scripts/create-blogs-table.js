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
Object.defineProperty(exports, "__esModule", { value: true });
// Run this script once to create the blogs table in your production database
// Usage: npx tsx src/scripts/create-blogs-table.ts
require("dotenv/config");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Creating blogs table...');
            yield db_1.db.execute((0, drizzle_orm_1.sql) `
            CREATE TABLE IF NOT EXISTS \`blogs\` (
                \`id\` VARCHAR(36) PRIMARY KEY,
                \`title\` VARCHAR(255) NOT NULL,
                \`slug\` VARCHAR(255) NOT NULL UNIQUE,
                \`content\` TEXT NOT NULL,
                \`excerpt\` VARCHAR(500),
                \`cover_image\` TEXT,
                \`authorId\` INT NOT NULL,
                \`status\` ENUM('DRAFT','PUBLISHED') DEFAULT 'DRAFT' NOT NULL,
                \`category\` VARCHAR(100),
                \`tags\` JSON,
                \`views\` INT DEFAULT 0 NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                INDEX \`blogs_status_idx\` (\`status\`),
                INDEX \`blogs_author_idx\` (\`authorId\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
            console.log('✅ blogs table created (or already exists)!');
            process.exit(0);
        }
        catch (e) {
            console.error('❌ Error creating blogs table:', e);
            process.exit(1);
        }
    });
}
run();
