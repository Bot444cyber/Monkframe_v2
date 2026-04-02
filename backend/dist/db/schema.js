"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterSubscribers = exports.notificationsRelations = exports.notifications = exports.commentsRelations = exports.comments = exports.wishlistsRelations = exports.wishlists = exports.likesRelations = exports.likes = exports.paymentsRelations = exports.payments = exports.uisRelations = exports.uis = exports.authOtp = exports.usersRelations = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    user_id: (0, mysql_core_1.int)('user_id').primaryKey().autoincrement(),
    full_name: (0, mysql_core_1.varchar)('full_name', { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 191 }).notNull().unique(),
    password_hash: (0, mysql_core_1.varchar)('password_hash', { length: 255 }),
    google_id: (0, mysql_core_1.varchar)('google_id', { length: 191 }).unique(),
    role: (0, mysql_core_1.mysqlEnum)('role', ['ADMIN', 'CUSTOMER', 'EDITOR']).default('CUSTOMER').notNull(),
    status: (0, mysql_core_1.mysqlEnum)('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE').notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
    last_active_at: (0, mysql_core_1.timestamp)('last_active_at').defaultNow().onUpdateNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    payments: many(exports.payments),
    createdUis: many(exports.uis),
    userLikes: many(exports.likes),
    comments: many(exports.comments),
    wishlists: many(exports.wishlists),
    notifications: many(exports.notifications),
}));
exports.authOtp = (0, mysql_core_1.mysqlTable)('AuthOtp', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    email: (0, mysql_core_1.varchar)('email', { length: 191 }).notNull().unique(),
    otp: (0, mysql_core_1.int)('otp').notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
exports.uis = (0, mysql_core_1.mysqlTable)('uis', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    price: (0, mysql_core_1.varchar)('price', { length: 50 }).notNull(),
    author: (0, mysql_core_1.varchar)('author', { length: 255 }).notNull(),
    category: (0, mysql_core_1.varchar)('category', { length: 100 }).notNull(),
    imageSrc: (0, mysql_core_1.text)('imageSrc').notNull(),
    google_file_id: (0, mysql_core_1.varchar)('google_file_id', { length: 255 }),
    color: (0, mysql_core_1.varchar)('color', { length: 50 }),
    tags: (0, mysql_core_1.json)('tags'),
    specifications: (0, mysql_core_1.json)('specifications'),
    overview: (0, mysql_core_1.text)('overview'),
    highlights: (0, mysql_core_1.json)('highlights'),
    showcase: (0, mysql_core_1.json)('showcase'),
    downloads: (0, mysql_core_1.int)('downloads').default(0).notNull(),
    likes: (0, mysql_core_1.int)('likes').default(0).notNull(),
    rating: (0, mysql_core_1.float)('rating').default(4.8).notNull(),
    creatorId: (0, mysql_core_1.int)('creatorId'),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
    fileType: (0, mysql_core_1.varchar)('fileType', { length: 20 }),
});
exports.uisRelations = (0, drizzle_orm_1.relations)(exports.uis, ({ one, many }) => ({
    creator: one(exports.users, {
        fields: [exports.uis.creatorId],
        references: [exports.users.user_id],
    }),
    payments: many(exports.payments),
    userLikes: many(exports.likes),
    comments: many(exports.comments),
    wishedBy: many(exports.wishlists),
    notifications: many(exports.notifications),
}));
exports.payments = (0, mysql_core_1.mysqlTable)('payments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    amount: (0, mysql_core_1.float)('amount').notNull(),
    status: (0, mysql_core_1.mysqlEnum)('status', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('PENDING').notNull(),
    stripePaymentIntentId: (0, mysql_core_1.varchar)('stripePaymentIntentId', { length: 191 }).unique(),
    userId: (0, mysql_core_1.int)('userId').notNull(),
    uiId: (0, mysql_core_1.varchar)('uiId', { length: 36 }).notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
});
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.payments.userId],
        references: [exports.users.user_id],
    }),
    ui: one(exports.uis, {
        fields: [exports.payments.uiId],
        references: [exports.uis.id],
    }),
}));
exports.likes = (0, mysql_core_1.mysqlTable)('likes', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    user_id: (0, mysql_core_1.int)('user_id').notNull(),
    ui_id: (0, mysql_core_1.varchar)('ui_id', { length: 36 }).notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    userUiUnique: (0, mysql_core_1.uniqueIndex)('user_ui_idx').on(table.user_id, table.ui_id),
}));
exports.likesRelations = (0, drizzle_orm_1.relations)(exports.likes, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.likes.user_id],
        references: [exports.users.user_id],
    }),
    ui: one(exports.uis, {
        fields: [exports.likes.ui_id],
        references: [exports.uis.id],
    }),
}));
exports.wishlists = (0, mysql_core_1.mysqlTable)('wishlists', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    user_id: (0, mysql_core_1.int)('user_id').notNull(),
    ui_id: (0, mysql_core_1.varchar)('ui_id', { length: 36 }).notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    userUiUnique: (0, mysql_core_1.uniqueIndex)('user_wishlist_idx').on(table.user_id, table.ui_id),
}));
exports.wishlistsRelations = (0, drizzle_orm_1.relations)(exports.wishlists, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.wishlists.user_id],
        references: [exports.users.user_id],
    }),
    ui: one(exports.uis, {
        fields: [exports.wishlists.ui_id],
        references: [exports.uis.id],
    }),
}));
exports.comments = (0, mysql_core_1.mysqlTable)('comments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    content: (0, mysql_core_1.text)('content').notNull(),
    user_id: (0, mysql_core_1.int)('user_id').notNull(),
    ui_id: (0, mysql_core_1.varchar)('ui_id', { length: 36 }).notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
});
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.comments.user_id],
        references: [exports.users.user_id],
    }),
    ui: one(exports.uis, {
        fields: [exports.comments.ui_id],
        references: [exports.uis.id],
    }),
}));
exports.notifications = (0, mysql_core_1.mysqlTable)('notifications', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey().$defaultFn(() => (0, crypto_1.randomUUID)()),
    type: (0, mysql_core_1.mysqlEnum)('type', ['PAYMENT', 'COMMENT', 'LIKE', 'WISHLIST', 'SYSTEM']).notNull(),
    message: (0, mysql_core_1.text)('message').notNull(),
    isRead: (0, mysql_core_1.boolean)('isRead').default(false).notNull(),
    userId: (0, mysql_core_1.int)('userId').notNull(),
    uiId: (0, mysql_core_1.varchar)('uiId', { length: 36 }),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.user_id],
    }),
    ui: one(exports.uis, {
        fields: [exports.notifications.uiId],
        references: [exports.uis.id],
    }),
}));
exports.newsletterSubscribers = (0, mysql_core_1.mysqlTable)('newsletter_subscribers', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    email: (0, mysql_core_1.varchar)('email', { length: 191 }).notNull().unique(),
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
});
