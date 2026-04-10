import { db } from './src/db';
import { users, wishlists, uis } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';

async function run() {
    console.log("Checking users...");
    const allUsers = await db.select().from(users);
    console.log("Users:", allUsers.map(u => ({ id: u.user_id, role: u.role, name: u.full_name })));

    console.log("Checking wishlists...");
    const allWishlists = await db.select().from(wishlists);
    console.log("Wishlists:", allWishlists);

    for (const user of allUsers) {
        console.log(`\n--- Wishlist for user ${user.user_id} (${user.role}) ---`);
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

        console.log(`Rows returned for user ${user.user_id}:`, rows.length);
        console.log(rows);
    }
    process.exit(0);
}
run().catch(console.error);
