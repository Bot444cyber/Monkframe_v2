import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { db } from '../db';
import { users, wishlists as wishlistsTable, payments as paymentsTable, uis, likes } from '../db/schema';
import { eq, desc, count, and } from 'drizzle-orm';
import GenerateToken from '../config/module/generator/GenerateToken';
import { getIO } from '../config/socket';
import { transformToProxy } from '../utils/helpers';

// Initiate Google Login
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

// Handle Google Callback
export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: true
    }, async (err: any, profile: any, info: any) => {
        console.log('🔍 Google Auth Callback Started');
        if (err) {
            console.error('❌ Google Auth Error (Passport):', err);
            return next(err);
        }

        if (!profile) {
            console.error('❌ Google Auth Error: No Profile received');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
        }

        try {
            const googleId = String(profile.id); // Force string — Google IDs exceed JS/MySQL numeric limits
            console.log('🔍 Processing Google Profile:', googleId, profile.emails?.[0]?.value);

            // Check if user exists with this google_id
            // Wrapped in try-catch in case the DB column type is BIGINT (not VARCHAR) and overflows
            let user: typeof users.$inferSelect | undefined;
            try {
                const [found] = await db.select().from(users).where(eq(users.google_id, googleId)).limit(1);
                user = found;
            } catch (googleIdQueryError) {
                console.warn('⚠️ google_id lookup failed, falling through to email lookup.', googleIdQueryError);
                user = undefined;
            }

            if (!user) {
                console.log('ℹ️ User not found by Google ID, checking email...');
                // Check by email if user exists to link accounts
                if (profile.emails && profile.emails.length > 0) {
                    const [existingEmailUser] = await db.select().from(users).where(eq(users.email, profile.emails[0].value)).limit(1);

                    if (existingEmailUser) {
                        console.log('✅ Linking to existing email user:', existingEmailUser.user_id);
                        await db.update(users).set({ google_id: googleId }).where(eq(users.user_id, existingEmailUser.user_id));
                        const [refetched] = await db.select().from(users).where(eq(users.user_id, existingEmailUser.user_id)).limit(1);
                        user = refetched;
                    }
                    else {
                        console.log('🆕 Creating new user from Google profile');
                        // Create new user
                        await db.insert(users).values({
                            google_id: googleId,
                            email: profile.emails[0].value,
                            full_name: profile.displayName,
                            password_hash: '',
                        });
                        const [createdUser] = await db.select().from(users).where(eq(users.email, profile.emails[0].value)).limit(1);
                        user = createdUser;

                        // Standardize user object for dashboard
                        if (user) {
                            const formattedUser = {
                                id: user.user_id,
                                name: user.full_name,
                                email: user.email,
                                role: user.role,
                                joinedDate: user.created_at.toISOString().split('T')[0],
                                purchases: 0,
                                lifetimeValue: 0
                            };
                            getIO().emit('user:new', { user: formattedUser });
                        }
                    }
                } else {
                    console.log('⚠️ No email in profile, creating fallback user');
                    const fallbackEmail = `${googleId}@google.oauth`;
                    await db.insert(users).values({
                        google_id: googleId,
                        email: fallbackEmail, // Fallback email
                        full_name: profile.displayName,
                        password_hash: '',
                    });

                    const [fallbackUser] = await db.select().from(users).where(eq(users.email, fallbackEmail)).limit(1);
                    user = fallbackUser;

                    if (user) {
                        const formattedUser = {
                            id: user.user_id,
                            name: user.full_name,
                            email: user.email,
                            role: user.role,
                            joinedDate: user.created_at.toISOString().split('T')[0],
                            purchases: 0,
                            lifetimeValue: 0
                        };
                        getIO().emit('user:new', { user: formattedUser });
                    }
                }
            } else {
                console.log('✅ User found by Google ID:', user.user_id);
            }

            if (!user) {
                throw new Error("User creation failed");
            }

            console.log('🔐 Attempting to log in user:', user.user_id);
            req.logIn(user, (err) => {
                if (err) {
                    console.error('❌ Login Error (req.logIn):', err);
                    return next(err);
                }

                console.log('✅ Login Successful, generating token...');
                const token = GenerateToken({
                    full_name: user!.full_name,
                    role: user!.role,
                    user_id: user!.user_id,
                    email: user!.email
                });

                console.log('🚀 Redirecting to frontend...');
                // Successful authentication
                return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
            });

        } catch (error) {
            console.error('❌ Google Auth Logic Error:', error);
            return next(error);
        }
    })(req, res, next);
};

// Logout User
export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(200).json({ message: "Logged out successfully" });
    });
};

// Get Current User (for frontend session check)
export const getCurrentUser = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false, user: null });
    }
};

// Get User Profile with Wishlist and Purchases
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        // Parse query params for pagination
        const wishlistPage = parseInt(req.query.wishlistPage as string) || 1;
        const wishlistLimit = parseInt(req.query.wishlistLimit as string) || 6;
        const paymentsPage = parseInt(req.query.paymentsPage as string) || 1;
        const paymentsLimit = parseInt(req.query.paymentsLimit as string) || 5;

        // Get basic user data (no joins needed here)
        const [user] = await db.select().from(users).where(eq(users.user_id, userId)).limit(1);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Get counts
        const [[wishlistCount], [paymentCount]] = await Promise.all([
            db.select({ value: count() }).from(wishlistsTable).where(eq(wishlistsTable.user_id, userId)),
            db.select({ value: count() }).from(paymentsTable).where(eq(paymentsTable.userId, userId))
        ]);
        const countWishlists = wishlistCount.value;
        const countPayments = paymentCount.value;

        // Fetch wishlist items with UI details via leftJoin
        const wishlistRows = await db
            .select({
                wishlist_id: wishlistsTable.id,
                ui_id: uis.id,
                ui_title: uis.title,
                ui_price: uis.price,
                ui_author: uis.author,
                ui_category: uis.category,
                ui_imageSrc: uis.imageSrc,
                ui_color: uis.color,
                ui_tags: uis.tags,
                ui_downloads: uis.downloads,
                ui_likes: uis.likes,
                ui_rating: uis.rating,
                ui_fileType: uis.fileType,
                ui_creatorId: uis.creatorId,
                creator_name: users.full_name,
            })
            .from(wishlistsTable)
            .leftJoin(uis, eq(uis.id, wishlistsTable.ui_id))
            .leftJoin(users, eq(users.user_id, uis.creatorId))
            .where(eq(wishlistsTable.user_id, userId))
            .orderBy(desc(wishlistsTable.created_at))
            .limit(wishlistLimit)
            .offset((wishlistPage - 1) * wishlistLimit);

        // Fetch liked/wished status for each UI in one batch
        const wishlistUiIds = wishlistRows.map(r => r.ui_id).filter(Boolean) as string[];
        const [likedRows] = await Promise.all([
            wishlistUiIds.length > 0
                ? db.select({ ui_id: likes.ui_id }).from(likes)
                    .where(and(eq(likes.user_id, userId)))
                : Promise.resolve([]),
        ]);
        const likedSet = new Set((likedRows as any[]).map((r: any) => r.ui_id));

        const wishlistData = wishlistRows
            .filter(r => r.ui_id)
            .map(r => ({
                id: r.ui_id,
                title: r.ui_title,
                price: r.ui_price,
                author: r.ui_author,
                category: r.ui_category,
                imageSrc: transformToProxy(r.ui_imageSrc || '', req),
                color: r.ui_color,
                tags: r.ui_tags,
                downloads: r.ui_downloads,
                likes: r.ui_likes,
                rating: r.ui_rating,
                fileType: r.ui_fileType,
                creatorId: r.ui_creatorId,
                liked: likedSet.has(r.ui_id!),
                wished: true,
            }));

        // Fetch payment items with UI details via leftJoin
        const paymentRows = await db
            .select({
                id: paymentsTable.id,
                amount: paymentsTable.amount,
                status: paymentsTable.status,
                stripePaymentIntentId: paymentsTable.stripePaymentIntentId,
                userId: paymentsTable.userId,
                uiId: paymentsTable.uiId,
                created_at: paymentsTable.created_at,
                updated_at: paymentsTable.updated_at,
                ui_id: uis.id,
                ui_title: uis.title,
                ui_price: uis.price,
                ui_imageSrc: uis.imageSrc,
                ui_category: uis.category,
                ui_fileType: uis.fileType,
            })
            .from(paymentsTable)
            .leftJoin(uis, eq(uis.id, paymentsTable.uiId))
            .where(eq(paymentsTable.userId, userId))
            .orderBy(desc(paymentsTable.created_at))
            .limit(paymentsLimit)
            .offset((paymentsPage - 1) * paymentsLimit);

        const paymentsRes = paymentRows.map(r => ({
            id: r.id,
            amount: r.amount,
            status: r.status,
            stripePaymentIntentId: r.stripePaymentIntentId,
            userId: r.userId,
            uiId: r.uiId,
            created_at: r.created_at,
            updated_at: r.updated_at,
            ui: r.ui_id ? {
                id: r.ui_id,
                title: r.ui_title,
                price: r.ui_price,
                imageSrc: transformToProxy(r.ui_imageSrc || '', req),
                category: r.ui_category,
                fileType: r.ui_fileType,
            } : null,
        }));

        res.json({
            status: true,
            data: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                status: user.status,
                created_at: user.created_at,
                google_id: user.google_id,
                payments: paymentsRes,
                wishlist: wishlistData,
                meta: {
                    wishlist: {
                        page: wishlistPage,
                        limit: wishlistLimit,
                        total: countWishlists,
                        totalPages: Math.ceil(countWishlists / wishlistLimit)
                    },
                    payments: {
                        page: paymentsPage,
                        limit: paymentsLimit,
                        total: countPayments,
                        totalPages: Math.ceil(countPayments / paymentsLimit)
                    }
                }
            }
        });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch profile" });
    }
};
