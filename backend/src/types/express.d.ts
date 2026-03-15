import { users } from '../db/schema';
import { InferSelectModel } from 'drizzle-orm';

type UserModel = InferSelectModel<typeof users>;

declare global {
    namespace Express {
        interface User extends UserModel { }
    }
}
