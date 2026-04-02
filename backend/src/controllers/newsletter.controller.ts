import { Request, Response } from 'express';
import Database from '../design/DataBase';
import { newsletterSubscribers } from '../db/schema';
import logger from '../utils/logger';

export const subscribeToNewsletter = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            res.status(400).json({ status: false, message: 'Valid email is required' });
            return;
        }

        const db = Database.getInstance().getDb();
        if (!db) {
            res.status(500).json({ status: false, message: 'Database not available' });
            return;
        }

        // Add subscriber
        try {
            await db.insert(newsletterSubscribers).values({ email });
            res.status(201).json({ status: true, message: 'Successfully subscribed to the newsletter' });
        } catch (dbError: any) {
            // Handle duplicate entry (ER_DUP_ENTRY for MySQL)
            if (dbError.code === 'ER_DUP_ENTRY' || dbError.message.includes('Duplicate')) {
                res.status(200).json({ status: true, message: 'You are already subscribed to the newsletter!' });
                return;
            }
            throw dbError; // rethrow to general catch
        }
    } catch (error) {
        logger.error('Error in newsletter subscription', { error: String(error) });
        res.status(500).json({ status: false, message: 'Internal server error while subscribing' });
    }
};
