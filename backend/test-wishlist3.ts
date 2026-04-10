import { db } from './src/db';
import { users, wishlists, uis } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';

async function run() {
    const rows = await db
        .select({
            wishlist_id: wishlists.id,
            ui_id: uis.id,
            ui_title: uis.title,
            ui_creatorId: uis.creatorId,
            creator_name: users.full_name,
        })
        .from(wishlists)
        .leftJoin(uis, eq(uis.id, wishlists.ui_id))
        .leftJoin(users, eq(users.user_id, uis.creatorId))
        .where(eq(wishlists.user_id, 9))
        .orderBy(desc(wishlists.created_at));

    console.log(JSON.stringify(rows, null, 2));

    const checkUi = await db.select().from(uis).where(eq(uis.id, "fe9d43e1-c7b1-4f3e-b97f-48e6f8e8c9b4"));
    console.log("Check UI:", JSON.stringify(checkUi, null, 2));

    process.exit(0);
}
run().catch(console.error);
