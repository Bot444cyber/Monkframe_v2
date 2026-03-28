import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { payments, uis, notifications, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { sendPaymentSuccessEmail } from '../services/email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // @ts-ignore
    apiVersion: '2024-12-18.acacia',

});

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'usd', uiId } = req.body;
        const userId = (req.user as any)?.user_id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!amount || !uiId) {
            res.status(400).json({ error: 'Amount and UI ID are required' });
            return;
        }

        const paymentIntent = await stripe.paymentIntents.create({
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

        const paymentId = randomUUID();
        await db.insert(payments).values({
            id: paymentId,
            amount: amount / 100, // Store in main currency unit (e.g., dollars), stripe is in cents
            status: 'PENDING',
            userId: parseInt(userId),
            uiId: uiId,
            stripePaymentIntentId: paymentIntent.id
        });

        // Fetch full details for real-time update via leftJoin (avoids Drizzle broken sub-query)
        const [fullPaymentRow] = await db
            .select({
                id: payments.id,
                amount: payments.amount,
                status: payments.status,
                stripePaymentIntentId: payments.stripePaymentIntentId,
                created_at: payments.created_at,
                user_full_name: users.full_name,
                user_email: users.email,
                ui_title: uis.title,
            })
            .from(payments)
            .leftJoin(users, eq(users.user_id, payments.userId))
            .leftJoin(uis, eq(uis.id, payments.uiId))
            .where(eq(payments.id, paymentId))
            .limit(1);

        if (fullPaymentRow?.user_full_name && fullPaymentRow?.ui_title) {
            // Standardized payment object for dashboard
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            res.status(400).json({ error: 'Payment Intent ID is required' });
            return;
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            await db.update(payments)
                .set({ status: 'COMPLETED' })
                .where(eq(payments.stripePaymentIntentId, paymentIntentId));

            // Fetch UI details for better message
            const [ui] = await db.select({ title: uis.title }).from(uis).where(eq(uis.id, paymentIntent.metadata.uiId)).limit(1);
            const uiTitle = ui?.title || paymentIntent.metadata.uiId;
            const message = `Payment Successful: ${uiTitle}`;

            // Create Notification
            await db.insert(notifications).values({
                id: randomUUID(),
                type: 'PAYMENT',
                message: message,
                userId: parseInt(paymentIntent.metadata.userId),
                uiId: paymentIntent.metadata.uiId,
                isRead: false
            });

            // Send Payment Success Email
            const [user] = await db.select({ email: users.email }).from(users).where(eq(users.user_id, parseInt(paymentIntent.metadata.userId))).limit(1);
            if (user?.email) {
                await sendPaymentSuccessEmail(user.email, {
                    orderId: paymentIntent.id.slice(-8).toUpperCase(),
                    amount: `$${(paymentIntent.amount / 100).toFixed(2)}`,
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    planName: uiTitle
                });
            }

            res.json({ success: true, status: 'COMPLETED' });
        } else {
            // Update local database to FAILED if it was not successful
            await db.update(payments)
                .set({ status: 'FAILED', updated_at: new Date() })
                .where(eq(payments.stripePaymentIntentId, paymentIntentId));

            res.status(400).json({ success: false, status: paymentIntent.status });
        }
    } catch (error: any) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
};
