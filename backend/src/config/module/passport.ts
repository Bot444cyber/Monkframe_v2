import passport from 'passport';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: `${process.env.BACKEND_URL}/api/auth/callback/google`,
            proxy: true,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                // Just pass the profile to the controller
                return done(null, profile);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    const id = user.user_id;
    if (!id || typeof id !== 'number') {
        return done(new Error('serializeUser: user_id is missing or not a number'), null);
    }
    done(null, id);
});

passport.deserializeUser(async (id: any, done) => {
    try {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId <= 0) {
            return done(null, false);
        }
        const user = await db.query.users.findFirst({
            where: eq(users.user_id, numericId),
        });
        done(null, user ?? false);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
