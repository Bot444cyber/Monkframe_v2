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
    done(null, user.user_id || user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.user_id, id),
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
