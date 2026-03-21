import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function main() {
  console.log('Connecting to Hostinger database...');
  
  // Create a direct connection to Hostinger
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    // If Hostinger rejects it, uncomment the line below:
    // ssl: { rejectUnauthorized: false }
  });

  const db = drizzle(connection);

  console.log('Applying migrations from drizzle folder...');
  
  // Point this to where your .sql files live
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  
  // Note: if your sql files are in './drizzle/migrations', update the path above!

  console.log('✅ Migrations applied successfully!');
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});