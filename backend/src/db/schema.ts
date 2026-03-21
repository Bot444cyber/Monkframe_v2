import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  text,
  float,
  boolean,
  json,
  mysqlEnum,
  uniqueIndex
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const users = mysqlTable('users', {
  user_id: int('user_id').primaryKey().autoincrement(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }),
  google_id: varchar('google_id', { length: 191 }).unique(),
  role: mysqlEnum('role', ['ADMIN', 'CUSTOMER', 'EDITOR']).default('CUSTOMER').notNull(),
  status: mysqlEnum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  last_active_at: timestamp('last_active_at').defaultNow().onUpdateNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  createdUis: many(uis),
  userLikes: many(likes),
  comments: many(comments),
  wishlists: many(wishlists),
  notifications: many(notifications),
}));

export const authOtp = mysqlTable('AuthOtp', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  otp: int('otp').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const uis = mysqlTable('uis', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  price: varchar('price', { length: 50 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  imageSrc: text('imageSrc').notNull(),
  google_file_id: varchar('google_file_id', { length: 255 }),
  color: varchar('color', { length: 50 }),
  tags: json('tags'),
  specifications: json('specifications'),
  overview: text('overview'),
  highlights: json('highlights'),
  showcase: json('showcase'),
  downloads: int('downloads').default(0).notNull(),
  likes: int('likes').default(0).notNull(),
  rating: float('rating').default(4.8).notNull(),
  creatorId: int('creatorId'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  fileType: varchar('fileType', { length: 20 }),
});

export const uisRelations = relations(uis, ({ one, many }) => ({
  creator: one(users, {
    fields: [uis.creatorId],
    references: [users.user_id],
  }),
  payments: many(payments),
  userLikes: many(likes),
  comments: many(comments),
  wishedBy: many(wishlists),
  notifications: many(notifications),
}));

export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  amount: float('amount').notNull(),
  status: mysqlEnum('status', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('PENDING').notNull(),
  stripePaymentIntentId: varchar('stripePaymentIntentId', { length: 191 }).unique(),
  userId: int('userId').notNull(),
  uiId: varchar('uiId', { length: 36 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.user_id],
  }),
  ui: one(uis, {
    fields: [payments.uiId],
    references: [uis.id],
  }),
}));

export const likes = mysqlTable('likes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  user_id: int('user_id').notNull(),
  ui_id: varchar('ui_id', { length: 36 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userUiUnique: uniqueIndex('user_ui_idx').on(table.user_id, table.ui_id),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.user_id],
    references: [users.user_id],
  }),
  ui: one(uis, {
    fields: [likes.ui_id],
    references: [uis.id],
  }),
}));

export const wishlists = mysqlTable('wishlists', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  user_id: int('user_id').notNull(),
  ui_id: varchar('ui_id', { length: 36 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userUiUnique: uniqueIndex('user_wishlist_idx').on(table.user_id, table.ui_id),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.user_id],
    references: [users.user_id],
  }),
  ui: one(uis, {
    fields: [wishlists.ui_id],
    references: [uis.id],
  }),
}));

export const comments = mysqlTable('comments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  content: text('content').notNull(),
  user_id: int('user_id').notNull(),
  ui_id: varchar('ui_id', { length: 36 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.user_id],
    references: [users.user_id],
  }),
  ui: one(uis, {
    fields: [comments.ui_id],
    references: [uis.id],
  }),
}));

export const notifications = mysqlTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  type: mysqlEnum('type', ['PAYMENT', 'COMMENT', 'LIKE', 'WISHLIST', 'SYSTEM']).notNull(),
  message: text('message').notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  userId: int('userId').notNull(),
  uiId: varchar('uiId', { length: 36 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.user_id],
  }),
  ui: one(uis, {
    fields: [notifications.uiId],
    references: [uis.id],
  }),
}));
