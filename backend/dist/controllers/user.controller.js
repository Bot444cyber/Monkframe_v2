"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heartbeat = exports.getUserProfile = exports.getCurrentUser = exports.logout = exports.googleAuthCallback = exports.googleAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const GenerateToken_1 = __importDefault(require("../config/module/generator/GenerateToken"));
const helpers_1 = require("../utils/helpers");
// Initiate Google Login
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
});
// Handle Google Callback
const googleAuthCallback = (req, res, next) => {
    passport_1.default.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: true
    }, (err, profile, info) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
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
            console.log('🔍 Processing Google Profile:', googleId, (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value);
            // Check if user exists with this google_id
            // Wrapped in try-catch in case the DB column type is BIGINT (not VARCHAR) and overflows
            let user;
            try {
                const [found] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.google_id, googleId)).limit(1);
                user = found;
            }
            catch (googleIdQueryError) {
                console.warn('⚠️ google_id lookup failed, falling through to email lookup.', googleIdQueryError);
                user = undefined;
            }
            if (!user) {
                console.log('ℹ️ User not found by Google ID, checking email...');
                // Check by email if user exists to link accounts
                if (profile.emails && profile.emails.length > 0) {
                    const [existingEmailUser] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, profile.emails[0].value)).limit(1);
                    if (existingEmailUser) {
                        console.log('✅ Linking to existing email user:', existingEmailUser.user_id);
                        yield db_1.db.update(schema_1.users).set({ google_id: googleId }).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, existingEmailUser.user_id));
                        const [refetched] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, existingEmailUser.user_id)).limit(1);
                        user = refetched;
                    }
                    else {
                        console.log('🆕 Creating new user from Google profile');
                        // Create new user
                        yield db_1.db.insert(schema_1.users).values({
                            google_id: googleId,
                            email: profile.emails[0].value,
                            full_name: profile.displayName,
                            password_hash: '',
                        });
                        const [createdUser] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, profile.emails[0].value)).limit(1);
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
                        }
                    }
                }
                else {
                    console.log('⚠️ No email in profile, creating fallback user');
                    const fallbackEmail = `${googleId}@google.oauth`;
                    yield db_1.db.insert(schema_1.users).values({
                        google_id: googleId,
                        email: fallbackEmail, // Fallback email
                        full_name: profile.displayName,
                        password_hash: '',
                    });
                    const [fallbackUser] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, fallbackEmail)).limit(1);
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
                    }
                }
            }
            else {
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
                const token = (0, GenerateToken_1.default)({
                    full_name: user.full_name,
                    role: user.role,
                    user_id: user.user_id,
                    email: user.email,
                    dashboard_access: user.dashboard_access
                });
                console.log('🚀 Redirecting to frontend...');
                // Successful authentication
                return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
            });
        }
        catch (error) {
            console.error('❌ Google Auth Logic Error:', error);
            return next(error);
        }
    }))(req, res, next);
};
exports.googleAuthCallback = googleAuthCallback;
// Logout User
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: "Logged out successfully" });
    });
};
exports.logout = logout;
// Get Current User (for frontend session check)
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    }
    else {
        res.json({ isAuthenticated: false, user: null });
    }
};
exports.getCurrentUser = getCurrentUser;
// Get User Profile with Wishlist and Purchases
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }
        // Parse query params for pagination
        const wishlistPage = parseInt(req.query.wishlistPage) || 1;
        const wishlistLimit = parseInt(req.query.wishlistLimit) || 6;
        const paymentsPage = parseInt(req.query.paymentsPage) || 1;
        const paymentsLimit = parseInt(req.query.paymentsLimit) || 5;
        // Get basic user data (no joins needed here)
        const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.user_id, userId)).limit(1);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        // Get counts
        const [wishlistCountResult] = yield db_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(schema_1.wishlists)
            .innerJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.wishlists.ui_id))
            .where((0, drizzle_orm_1.eq)(schema_1.wishlists.user_id, userId));
        const paymentCountResult = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.userId, userId));
        const countWishlists = (wishlistCountResult === null || wishlistCountResult === void 0 ? void 0 : wishlistCountResult.value) || 0;
        const countPayments = ((_b = paymentCountResult[0]) === null || _b === void 0 ? void 0 : _b.value) || 0;
        // Fetch wishlist items with UI details via innerJoin to exclude orphans
        const wishlistRows = yield db_1.db
            .select({
            wishlist_id: schema_1.wishlists.id,
            ui_id: schema_1.uis.id,
            ui_title: schema_1.uis.title,
            ui_price: schema_1.uis.price,
            ui_author: schema_1.uis.author,
            ui_category: schema_1.uis.category,
            ui_imageSrc: schema_1.uis.imageSrc,
            ui_color: schema_1.uis.color,
            ui_tags: schema_1.uis.tags,
            ui_downloads: schema_1.uis.downloads,
            ui_likes: schema_1.uis.likes,
            ui_rating: schema_1.uis.rating,
            ui_fileType: schema_1.uis.fileType,
            ui_creatorId: schema_1.uis.creatorId,
            creator_name: schema_1.users.full_name,
        })
            .from(schema_1.wishlists)
            .innerJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.wishlists.ui_id))
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.uis.creatorId))
            .where((0, drizzle_orm_1.eq)(schema_1.wishlists.user_id, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.wishlists.created_at))
            .limit(wishlistLimit)
            .offset((wishlistPage - 1) * wishlistLimit);
        // Fetch liked/wished status for each UI in one batch
        const wishlistUiIds = wishlistRows.map(r => r.ui_id).filter(Boolean);
        const [likedRows] = yield Promise.all([
            wishlistUiIds.length > 0
                ? db_1.db.select({ ui_id: schema_1.likes.ui_id }).from(schema_1.likes)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.likes.user_id, userId)))
                : Promise.resolve([]),
        ]);
        const likedSet = new Set(likedRows.map((r) => r.ui_id));
        const wishlistData = wishlistRows
            .filter(r => r.ui_id)
            .map(r => ({
            id: r.ui_id,
            title: r.ui_title,
            price: r.ui_price,
            author: r.ui_author,
            category: r.ui_category,
            imageSrc: (0, helpers_1.transformToProxy)(r.ui_imageSrc || '', req),
            color: r.ui_color,
            tags: r.ui_tags,
            downloads: r.ui_downloads,
            likes: r.ui_likes,
            rating: r.ui_rating,
            fileType: r.ui_fileType,
            creatorId: r.ui_creatorId,
            liked: likedSet.has(r.ui_id),
            wished: true,
        }));
        // Fetch payment items with UI details via leftJoin
        const paymentRows = yield db_1.db
            .select({
            id: schema_1.payments.id,
            amount: schema_1.payments.amount,
            status: schema_1.payments.status,
            stripePaymentIntentId: schema_1.payments.stripePaymentIntentId,
            userId: schema_1.payments.userId,
            uiId: schema_1.payments.uiId,
            created_at: schema_1.payments.created_at,
            updated_at: schema_1.payments.updated_at,
            ui_id: schema_1.uis.id,
            ui_title: schema_1.uis.title,
            ui_price: schema_1.uis.price,
            ui_imageSrc: schema_1.uis.imageSrc,
            ui_category: schema_1.uis.category,
            ui_fileType: schema_1.uis.fileType,
        })
            .from(schema_1.payments)
            .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.payments.uiId))
            .where((0, drizzle_orm_1.eq)(schema_1.payments.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.payments.created_at))
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
                imageSrc: (0, helpers_1.transformToProxy)(r.ui_imageSrc || '', req),
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
    }
    catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch profile" });
    }
});
exports.getUserProfile = getUserProfile;
// Update user heartbeat for presence tracking
const heartbeat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }
        // Update last_active_at to current timestamp
        yield db_1.db.update(schema_1.users)
            .set({ last_active_at: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.user_id, userId));
        res.json({ status: true, message: "Heartbeat received" });
    }
    catch (error) {
        console.error("Heartbeat Error:", error);
        res.status(500).json({ status: false, message: "Failed to process heartbeat" });
    }
});
exports.heartbeat = heartbeat;
