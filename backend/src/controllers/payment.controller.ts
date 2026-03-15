import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getIO } from '../config/socket';
import { db } from '../db';
import { payments, uis, notifications, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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
            const formattedPayment = {
                id: fullPaymentRow.id,
                customerName: fullPaymentRow.user_full_name,
                email: fullPaymentRow.user_email,
                item: fullPaymentRow.ui_title,
                date: fullPaymentRow.created_at.toISOString().split('T')[0],
                amount: `$${fullPaymentRow.amount}`,
                status: fullPaymentRow.status.toLowerCase(),
                stripePaymentIntentId: fullPaymentRow.stripePaymentIntentId
            };

            // Emit real-time event
            getIO().emit('payment:new', { payment: formattedPayment });
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

            // Emit real-time update
            getIO().emit('payment:updated', { paymentIntentId, status: 'COMPLETED' });

            // Emit notification event to specific user and admins
            const userId = parseInt(paymentIntent.metadata.userId);

            // Fetch user details for real-time display
            const [userDetails] = await db.select({ full_name: users.full_name, email: users.email }).from(users).where(eq(users.user_id, userId)).limit(1);

            const notificationPayload = {
                type: 'PAYMENT',
                message: message,
                userId: userId,
                uiId: paymentIntent.metadata.uiId,
                user: userDetails, // Include user details
                ui: { title: uiTitle } // Include UI details
            };

            // To User
            getIO().to(userId.toString()).emit('new-notification', notificationPayload);
            // To Admins
            getIO().to('admin').emit('new-notification', notificationPayload);

            // Here you can unlock content, send email, etc.

            res.json({ success: true, status: 'COMPLETED' });
        } else {
            res.status(400).json({ success: false, status: paymentIntent.status });
        }
    } catch (error: any) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
};
