import dotenv from 'dotenv';
import CreateDB from '../config/module/DB/CreateDB';
import ConnectDB from '../config/module/DB/ConnectDB';
import DisconnectDB from '../config/module/DB/DisconnectDB';

// Load environment variables from .env file
dotenv.config();

class Database {
    [x: string]: any;
    private static instance = new Database();
    private isConnected: boolean = false;
    private isDatabaseCreated: boolean = false;

    private constructor() {
        // DEFAULT CONSTRUCTOR
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public async checkDatabaseExists(): Promise<boolean> {
        try {
            if (!process.env.DB_NAME) {
                console.warn('⚠️ Environment variable DB_NAME is not defined');
                return false;
            }

            // Try to connect to check if database exists
            await ConnectDB();
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
    }

    public async CheckAndCreate(): Promise<boolean> {
        try {
            if (!process.env.DB_NAME) {
                console.warn('⚠️ Environment variable DB_NAME is not defined');
                return false;
            }

            // Step 1: Check if database exists
            const databaseExists = await this.checkDatabaseExists();

            if (!databaseExists) {
                console.log('📋 Database not found, creating new database...');

                // Step 2: Create database if it doesn't exist
                const created = await this.create();
                if (!created) {
                    console.error('❌ Failed to create database');
                    return false;
                }

                // Step 3: Connect to the newly created database
                const connected = await this.connect();
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
    }

    public async create(): Promise<boolean> {
        try {
            if (!process.env.DB_NAME) {
                throw new Error('Environment variable DB_NAME is not defined');
            }

            console.log(`🔨 Creating database: ${process.env.DB_NAME}`);
            await CreateDB(process.env.DB_NAME);
            this.isDatabaseCreated = true;
            console.log('✅ Database created successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Error creating the database:', error);
            this.isDatabaseCreated = false;
            return false;
        }
    }

    public async connect(): Promise<boolean> {
        try {
            console.log('🔌 Connecting to database...');
            await ConnectDB();
            this.isConnected = true;
            console.log('✅ Database connected successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Error connecting to the database:', error);
            this.isConnected = false;
            return false;
        }
    }

    public async disconnect(): Promise<boolean> {
        try {
            await DisconnectDB();
            this.isConnected = false;
            console.log('✅ Database disconnected successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Error disconnecting from the database:', error);
            return false;
        }
    }

    public async initializeDatabase(): Promise<boolean> {
        try {
            console.log('🚀 Initializing database...');

            // Step 1: Check if database exists
            const databaseExists = await this.checkDatabaseExists();

            if (!databaseExists) {
                console.log('📋 Database not found, creating new database...');

                // Step 2: Create database if it doesn't exist
                const created = await this.create();
                if (!created) {
                    console.error('❌ Failed to create database');
                    return false;
                }

                // Step 3: Connect to the newly created database
                const connected = await this.connect();
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
    }

    public async retryConnection(maxRetries: number = 3): Promise<boolean> {
        console.log(`🔄 Attempting to reconnect to database (max ${maxRetries} retries)...`);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`🔄 Connection attempt ${attempt}/${maxRetries}`);

            const connected = await this.connect();
            if (connected) {
                console.log('✅ Database reconnection successful');
                return true;
            }

            if (attempt < maxRetries) {
                console.log(`⏳ Waiting 2 seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.error('❌ All database connection attempts failed');
        return false;
    }

    public async testConnection(): Promise<boolean> {
        try {
            await ConnectDB();
            return true;
        } catch (error) {
            return false;
        }
    }

    public getConnectionStatus(): { isConnected: boolean; isDatabaseCreated: boolean } {
        return {
            isConnected: this.isConnected,
            isDatabaseCreated: this.isDatabaseCreated
        };
    }

    public async forceReconnect(): Promise<boolean> {
        console.log('🔄 Forcing database reconnection...');

        // First disconnect if connected
        if (this.isConnected) {
            await this.disconnect();
        }

        // Then try to reconnect
        return await this.retryConnection(3);
    }
}

export default Database;
