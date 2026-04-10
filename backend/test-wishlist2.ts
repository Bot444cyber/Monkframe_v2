import { db } from './src/db';
import { users, wishlists, uis } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';
import fs from 'fs';

async function run() {
    const output: string[] = [];
    const allUsers = await db.select().from(users);
    output.push(JSON.stringify(allUsers, null, 2));

    const allWishlists = await db.select().from(wishlists);
    output.push("WISHLISTS TABLE DUMP:");
    output.push(JSON.stringify(allWishlists, null, 2));

    for (const user of allUsers) {
        const rows = await db
            .select({
                wishlist_id: wishlists.id,
                ui_id: uis.id,
                creator_name: users.full_name,
            })
            .from(wishlists)
            .leftJoin(uis, eq(uis.id, wishlists.ui_id))
            .leftJoin(users, eq(users.user_id, uis.creatorId))
            .where(eq(wishlists.user_id, user.user_id))
            .orderBy(desc(wishlists.created_at));

        output.push(`Rows for user ${user.user_id} (${user.role}): ${rows.length}`);
        output.push(JSON.stringify(rows, null, 2));
    }

    fs.writeFileSync('debug-output.json', output.join('\n\n'));
    process.exit(0);
}
run().catch(console.error);
