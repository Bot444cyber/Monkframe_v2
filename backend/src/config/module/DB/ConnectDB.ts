import { db } from '../../../db';

async function ConnectDB() {
  try {
    // Drizzle with mysql2 pool connects automatically on first query
    // We can do a simple query to ensure connection is working
    await db.execute('SELECT 1');
    console.log('Database connected successfully!');
  }
  catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

export default ConnectDB;