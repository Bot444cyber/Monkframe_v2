import { db } from '../db';
import { uis } from '../db/schema';
import { slugify } from '../utils/helpers';
import { eq } from 'drizzle-orm';

import { sql } from 'drizzle-orm';

async function populateSlugs() {
    console.log('Adding slug column if it doesn\'t exist...');
    try {
        await db.execute(sql`ALTER TABLE uis ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE`);
        console.log('Slug column verified/added.');
    } catch (err) {
        console.log('Note: ALTER TABLE IF NOT EXISTS might not be supported in this MySQL version. If it fails, column likely already exists.');
        try {
            await db.execute(sql`ALTER TABLE uis ADD COLUMN slug VARCHAR(255) UNIQUE`);
            console.log('Slug column added.');
        } catch (innerErr: any) {
            if (innerErr.sqlMessage && innerErr.sqlMessage.includes('Duplicate column name')) {
                console.log('Slug column already exists.');
            } else {
                console.error('Error adding slug column:', innerErr);
            }
        }
    }

    console.log('Fetching products...');
    const allUis = await db.select().from(uis);

    console.log(`Found ${allUis.length} products. Updating slugs...`);

    for (const ui of allUis) {
        if (!ui.slug) {
            const newSlug = slugify(ui.title);
            console.log(`Updating "${ui.title}" -> ${newSlug}`);
            await db.update(uis).set({ slug: newSlug }).where(eq(uis.id, ui.id));
        }
    }

    console.log('Migration completed!');
    process.exit(0);
}

populateSlugs().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
