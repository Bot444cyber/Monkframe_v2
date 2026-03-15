import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
dotenv.config();

// Create the pool using an object to handle special characters safely
export const poolConnection = mysql.createPool({
  // Fallback to 127.0.0.1 if DB_HOST is missing
  host: process.env.DB_HOST || '127.0.0.1', 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Ensure port is a valid number, default to 3306
  port: Number(process.env.DB_PORT) || 3306, 
  
  waitForConnections: true,
  connectionLimit: 5, // Lower limit is safer for Hostinger shared plans
  queueLimit: 0,

  // Essential for keeping the connection alive on Hostinger
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });

// Add a quick check to log if the connection fails
poolConnection.getConnection()
  .then(conn => {
    console.log("✅ Database Pool Initialized");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Database Pool Error:", err.message);
  });