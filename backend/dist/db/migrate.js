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
require("dotenv/config");
const migrator_1 = require("drizzle-orm/mysql2/migrator");
const mysql2_1 = require("drizzle-orm/mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Connecting to Hostinger database...');
        // Create a direct connection to Hostinger
        const connection = yield promise_1.default.createConnection({
            uri: process.env.DATABASE_URL,
            // If Hostinger rejects it, uncomment the line below:
            // ssl: { rejectUnauthorized: false }
        });
        const db = (0, mysql2_1.drizzle)(connection);
        console.log('Applying migrations from drizzle folder...');
        // Point this to where your .sql files live
        yield (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle/migrations' });
        // Note: if your sql files are in './drizzle/migrations', update the path above!
        console.log('✅ Migrations applied successfully!');
        yield connection.end();
        process.exit(0);
    });
}
main().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
