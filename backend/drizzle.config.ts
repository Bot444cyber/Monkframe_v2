import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config();

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL! as string,
    },
    verbose: true,
    strict: true,
});
