import { users } from '../db/schema';
import { InferSelectModel } from 'drizzle-orm';
import * as express from 'express';

type UserModel = InferSelectModel<typeof users>;

declare global {
    namespace Express {
        interface User extends UserModel { }
        interface Request {
            user?: User;
            logIn(user: User, done: (err: any) => void): void;
            logIn(user: User, options: any, done: (err: any) => void): void;
            logout(options: { keepSessionInfo?: boolean }, done: (err: any) => void): void;
            logout(done: (err: any) => void): void;
            isAuthenticated(): boolean;
        }
    }
}
