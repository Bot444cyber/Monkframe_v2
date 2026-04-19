// Run this script once to create the blogs table in your production database
// Usage: npx tsx src/scripts/create-blogs-table.ts
import "dotenv/config";
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        console.log('Creating blogs table...');
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS \`blogs\` (
                \`id\` VARCHAR(36) PRIMARY KEY,
                \`title\` VARCHAR(255) NOT NULL,
                \`slug\` VARCHAR(255) NOT NULL UNIQUE,
                \`content\` TEXT NOT NULL,
                \`excerpt\` VARCHAR(500),
                \`cover_image\` TEXT,
                \`authorId\` INT NOT NULL,
                \`status\` ENUM('DRAFT','PUBLISHED') DEFAULT 'DRAFT' NOT NULL,
                \`category\` VARCHAR(100),
                \`tags\` JSON,
                \`views\` INT DEFAULT 0 NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                INDEX \`blogs_status_idx\` (\`status\`),
                INDEX \`blogs_author_idx\` (\`authorId\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ blogs table created (or already exists)!');
        process.exit(0);
    } catch (e) {
        console.error('❌ Error creating blogs table:', e);
        process.exit(1);
    }
}

run();
