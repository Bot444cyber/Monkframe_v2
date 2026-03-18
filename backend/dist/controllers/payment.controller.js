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
exports.confirmPayment = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    // @ts-ignore
    apiVersion: '2024-12-18.acacia',
});
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount, currency = 'usd', uiId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!amount || !uiId) {
            res.status(400).json({ error: 'Amount and UI ID are required' });
            return;
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId.toString(),
                uiId: uiId.toString()
            }
        });
        const paymentId = (0, crypto_1.randomUUID)();
        yield db_1.db.insert(schema_1.payments).values({
            id: paymentId,
            amount: amount / 100, // Store in main currency unit (e.g., dollars), stripe is in cents
            status: 'PENDING',
            userId: parseInt(userId),
            uiId: uiId,
            stripePaymentIntentId: paymentIntent.id
        });
        // Fetch full details for real-time update via leftJoin (avoids Drizzle broken sub-query)
        const [fullPaymentRow] = yield db_1.db
            .select({
            id: schema_1.payments.id,
            amount: schema_1.payments.amount,
            status: schema_1.payments.status,
            stripePaymentIntentId: schema_1.payments.stripePaymentIntentId,
            created_at: schema_1.payments.created_at,
            user_full_name: schema_1.users.full_name,
            user_email: schema_1.users.email,
            ui_title: schema_1.uis.title,
        })
            .from(schema_1.payments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.payments.userId))
            .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.payments.uiId))
            .where((0, drizzle_orm_1.eq)(schema_1.payments.id, paymentId))
            .limit(1);
        if ((fullPaymentRow === null || fullPaymentRow === void 0 ? void 0 : fullPaymentRow.user_full_name) && (fullPaymentRow === null || fullPaymentRow === void 0 ? void 0 : fullPaymentRow.ui_title)) {
            // Standardized payment object for dashboard
        }
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    }
    catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            res.status(400).json({ error: 'Payment Intent ID is required' });
            return;
        }
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            yield db_1.db.update(schema_1.payments)
                .set({ status: 'COMPLETED' })
                .where((0, drizzle_orm_1.eq)(schema_1.payments.stripePaymentIntentId, paymentIntentId));
            // Fetch UI details for better message
            const [ui] = yield db_1.db.select({ title: schema_1.uis.title }).from(schema_1.uis).where((0, drizzle_orm_1.eq)(schema_1.uis.id, paymentIntent.metadata.uiId)).limit(1);
            const uiTitle = (ui === null || ui === void 0 ? void 0 : ui.title) || paymentIntent.metadata.uiId;
            const message = `Payment Successful: ${uiTitle}`;
            // Create Notification
            yield db_1.db.insert(schema_1.notifications).values({
                id: (0, crypto_1.randomUUID)(),
                type: 'PAYMENT',
                message: message,
                userId: parseInt(paymentIntent.metadata.userId),
                uiId: paymentIntent.metadata.uiId,
                isRead: false
            });
            // Here you can unlock content, send email, etc.
            res.json({ success: true, status: 'COMPLETED' });
        }
        else {
            res.status(400).json({ success: false, status: paymentIntent.status });
        }
    }
    catch (error) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.confirmPayment = confirmPayment;
