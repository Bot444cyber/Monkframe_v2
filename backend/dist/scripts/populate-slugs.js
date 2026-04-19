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
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const helpers_1 = require("../utils/helpers");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
function populateSlugs() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Adding slug column if it doesn\'t exist...');
        try {
            yield db_1.db.execute((0, drizzle_orm_2.sql) `ALTER TABLE uis ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE`);
            console.log('Slug column verified/added.');
        }
        catch (err) {
            console.log('Note: ALTER TABLE IF NOT EXISTS might not be supported in this MySQL version. If it fails, column likely already exists.');
            try {
                yield db_1.db.execute((0, drizzle_orm_2.sql) `ALTER TABLE uis ADD COLUMN slug VARCHAR(255) UNIQUE`);
                console.log('Slug column added.');
            }
            catch (innerErr) {
                if (innerErr.sqlMessage && innerErr.sqlMessage.includes('Duplicate column name')) {
                    console.log('Slug column already exists.');
                }
                else {
                    console.error('Error adding slug column:', innerErr);
                }
            }
        }
        console.log('Fetching products...');
        const allUis = yield db_1.db.select().from(schema_1.uis);
        console.log(`Found ${allUis.length} products. Updating slugs...`);
        for (const ui of allUis) {
            if (!ui.slug) {
                const newSlug = (0, helpers_1.slugify)(ui.title);
                console.log(`Updating "${ui.title}" -> ${newSlug}`);
                yield db_1.db.update(schema_1.uis).set({ slug: newSlug }).where((0, drizzle_orm_1.eq)(schema_1.uis.id, ui.id));
            }
        }
        console.log('Migration completed!');
        process.exit(0);
    });
}
populateSlugs().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
