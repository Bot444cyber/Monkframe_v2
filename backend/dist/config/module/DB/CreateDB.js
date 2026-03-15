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
const promise_1 = __importDefault(require("mysql2/promise"));
function CreateDB(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/^[a-zA-Z0-9_-]+$/.test(dbName)) {
            throw new Error(`Invalid database name: ${dbName}. Only alphanumeric characters, underscores, and dashes are allowed.`);
        }
        // Connect to MySQL server (no database selected yet)
        const connection = yield promise_1.default.createConnection({
            user: process.env.DB_USER || 'root',
            host: process.env.DB_HOST || 'localhost',
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '3306'),
        });
        try {
            // Check if database exists
            const [rows] = yield connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [dbName]);
            if (rows.length === 0) {
                // Create the database
                yield connection.query(`CREATE DATABASE \`${dbName}\``);
                console.log(`✅ Database "${dbName}" created successfully.`);
            }
            else {
                console.log(`ℹ️ Database "${dbName}" already exists.`);
            }
        }
        catch (error) {
            console.error(`❌ Error creating database "${dbName}":`, error);
            throw error;
        }
        finally {
            yield connection.end();
        }
    });
}
exports.default = CreateDB;
