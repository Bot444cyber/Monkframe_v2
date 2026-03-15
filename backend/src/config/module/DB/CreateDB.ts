
import mysql from 'mysql2/promise';

async function CreateDB(dbName: string) {
    if (!/^[a-zA-Z0-9_-]+$/.test(dbName)) {
        throw new Error(`Invalid database name: ${dbName}. Only alphanumeric characters, underscores, and dashes are allowed.`);
    }

    // Connect to MySQL server (no database selected yet)
    const connection = await mysql.createConnection({
        user: process.env.DB_USER || 'root',
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '3306'),
    });

    try {
        // Check if database exists
        const [rows] = await connection.query(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [dbName]
        );

        if ((rows as any[]).length === 0) {
            // Create the database
            await connection.query(`CREATE DATABASE \`${dbName}\``);
            console.log(`✅ Database "${dbName}" created successfully.`);
        } else {
            console.log(`ℹ️ Database "${dbName}" already exists.`);
        }
    } catch (error: any) {
        console.error(`❌ Error creating database "${dbName}":`, error);
        throw error;
    } finally {
        await connection.end();
    }
}

export default CreateDB;