import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
dotenv.config();

// Create the pool using an object to handle special characters in the password safely
export const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Keep-alive settings
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });

