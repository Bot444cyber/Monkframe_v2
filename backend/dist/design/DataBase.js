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
const dotenv_1 = __importDefault(require("dotenv"));
const CreateDB_1 = __importDefault(require("../config/module/DB/CreateDB"));
const ConnectDB_1 = __importDefault(require("../config/module/DB/ConnectDB"));
const DisconnectDB_1 = __importDefault(require("../config/module/DB/DisconnectDB"));
// Load environment variables from .env file
dotenv_1.default.config();
class Database {
    constructor() {
        this.isConnected = false;
        this.isDatabaseCreated = false;
        // DEFAULT CONSTRUCTOR
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    checkDatabaseExists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!process.env.DB_NAME) {
                    console.warn('⚠️ Environment variable DB_NAME is not defined');
                    return false;
                }
                // Try to connect to check if database exists
                yield (0, ConnectDB_1.default)();
                this.isDatabaseCreated = true;
                this.isConnected = true;
                console.log('✅ Database exists and connection successful');
                return true;
            }
            catch (error) {
                console.log('ℹ️ Database does not exist or connection failed');
                this.isDatabaseCreated = false;
                this.isConnected = false;
                return false;
            }
        });
    }
    CheckAndCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!process.env.DB_NAME) {
                    console.warn('⚠️ Environment variable DB_NAME is not defined');
                    return false;
                }
                // Step 1: Check if database exists
                const databaseExists = yield this.checkDatabaseExists();
                if (!databaseExists) {
                    console.log('📋 Database not found, creating new database...');
                    // Step 2: Create database if it doesn't exist
                    const created = yield this.create();
                    if (!created) {
                        console.error('❌ Failed to create database');
                        return false;
                    }
                    // Step 3: Connect to the newly created database
                    const connected = yield this.connect();
                    if (!connected) {
                        console.error('❌ Failed to connect to newly created database');
                        return false;
                    }
                }
                console.log('🎉 Database check and creation completed successfully');
                return true;
            }
            catch (error) {
                console.error('❌ Database check and creation failed:', error);
                this.isDatabaseCreated = false;
                this.isConnected = false;
                return false;
            }
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!process.env.DB_NAME) {
                    throw new Error('Environment variable DB_NAME is not defined');
                }
                console.log(`🔨 Creating database: ${process.env.DB_NAME}`);
                yield (0, CreateDB_1.default)(process.env.DB_NAME);
                this.isDatabaseCreated = true;
                console.log('✅ Database created successfully');
                return true;
            }
            catch (error) {
                console.error('❌ Error creating the database:', error);
                this.isDatabaseCreated = false;
                return false;
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔌 Connecting to database...');
                yield (0, ConnectDB_1.default)();
                this.isConnected = true;
                console.log('✅ Database connected successfully');
                return true;
            }
            catch (error) {
                console.error('❌ Error connecting to the database:', error);
                this.isConnected = false;
                return false;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, DisconnectDB_1.default)();
                this.isConnected = false;
                console.log('✅ Database disconnected successfully');
                return true;
            }
            catch (error) {
                console.error('❌ Error disconnecting from the database:', error);
                return false;
            }
        });
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🚀 Initializing database...');
                // Step 1: Check if database exists
                const databaseExists = yield this.checkDatabaseExists();
                if (!databaseExists) {
                    console.log('📋 Database not found, creating new database...');
                    // Step 2: Create database if it doesn't exist
                    const created = yield this.create();
                    if (!created) {
                        console.error('❌ Failed to create database');
                        return false;
                    }
                    // Step 3: Connect to the newly created database
                    const connected = yield this.connect();
                    if (!connected) {
                        console.error('❌ Failed to connect to newly created database');
                        return false;
                    }
                }
                console.log('🎉 Database initialization completed successfully');
                return true;
            }
            catch (error) {
                console.error('❌ Database initialization failed:', error);
                return false;
            }
        });
    }
    retryConnection() {
        return __awaiter(this, arguments, void 0, function* (maxRetries = 3) {
            console.log(`🔄 Attempting to reconnect to database (max ${maxRetries} retries)...`);
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                console.log(`🔄 Connection attempt ${attempt}/${maxRetries}`);
                const connected = yield this.connect();
                if (connected) {
                    console.log('✅ Database reconnection successful');
                    return true;
                }
                if (attempt < maxRetries) {
                    console.log(`⏳ Waiting 2 seconds before retry...`);
                    yield new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            console.error('❌ All database connection attempts failed');
            return false;
        });
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ConnectDB_1.default)();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            isDatabaseCreated: this.isDatabaseCreated
        };
    }
    forceReconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔄 Forcing database reconnection...');
            // First disconnect if connected
            if (this.isConnected) {
                yield this.disconnect();
            }
            // Then try to reconnect
            return yield this.retryConnection(3);
        });
    }
}
Database.instance = new Database();
exports.default = Database;
