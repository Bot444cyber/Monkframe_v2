import OTP from '../design/Otp';
import { Auth } from '../design/Auth';
import { Request, Response } from 'express';
import { db } from '../db';
import { authOtp, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import sendOTPEmail from '../services/email.service';
import { randomUUID } from 'crypto';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }

        // Authenticate user
        const loginResult = await Auth.instance.login(email, password);
        if (!loginResult.status) {
            return res.status(401).json({ status: false, message: loginResult.message });
        }

        // Return success response with token or OTP requirement
        if (loginResult.requireOtp) {
            return res.json({ status: true, message: loginResult.message, requireOtp: true });
        }

        return res.json({ status: true, message: 'Login successful', token: loginResult.token });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

export const VerifyEmailByOTP = async (req: Request, res: Response) => {
    try {
        if (!req.body.email) {
            return res.json({ status: false, message: 'Email is required.' })
        }

        // If OTP is provided, verify it (Login 2nd Step)
        if (req.body.otp) {
            const verifyResult = await Auth.instance.verifyOtp(req.body.email, req.body.otp);
            if (!verifyResult.status) {
                return res.json({ status: false, message: verifyResult.message });
            }
            return res.json({ status: true, message: 'OTP verified', token: verifyResult.token });
        }

        // Otherwise generate OTP (Registration/Forgot Password flow)

        const [existingEmail] = await db.select().from(authOtp).where(eq(authOtp.email, req.body.email)).limit(1);

        if (existingEmail) {
            const generatedOTP = await OTP.SetupOTP(req.body.email);
            if (!generatedOTP) {
                return res.json({ status: false, message: 'OTP is not generated.' });
            }

            const [resp] = await db.update(authOtp)
                .set({
                    otp: parseInt(generatedOTP),
                    updatedAt: new Date()
                })
                .where(eq(authOtp.email, req.body.email));

            if (resp.affectedRows === 0) { // mysql2 return format check if needed
                return res.json({ status: false, message: 'Unable to update otp.' })
            }

            // Send OTP Email directly
            await sendOTPEmail(req.body.email, generatedOTP);

            return res.json({ status: true, message: 'OTP is updated.' });
        }

        const [existingUserCheck] = await db.select().from(users).where(eq(users.email, req.body.email)).limit(1);
        if (existingUserCheck) {
            return res.json({ status: false, message: 'User already registered.' })
        }

        const generatedOTP = await OTP.SetupOTP(req.body.email);
        if (!generatedOTP) {
            return res.json({ status: false, message: 'OTP is not generated.' });
        }

        const [response] = await db.insert(authOtp).values({
            email: req.body.email,
            otp: parseInt(generatedOTP)
        });

        if (response.affectedRows === 0) {
            return res.json({ status: true, message: 'Failed to insert data.' })
        }

        // Send OTP Email directly
        await sendOTPEmail(req.body.email, generatedOTP);

        // Return the otp success message...
        return res.json({ status: true, message: 'OTP is generated.', data: generatedOTP });
    }
    catch (error) {
        console.log("Error :- ", error);
        return res.json({ status: false, message: 'Internal Server Issue' })
    }
}


export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, otp } = req.body;

        if (!email || !password || !fullName || !otp) {
            return res.json({ status: false, message: 'All fields are required' });
        }

        const result = await Auth.instance.register(email, password, fullName, otp);
        if (!result.status) {
            return res.json({ status: false, message: result.message });
        }

        // Fetch the user object to emit (optional, but good for UI)
        const [newUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (newUser) {
            // Standardize user object for dashboard
            const formattedUser = {
                id: newUser.user_id,
                name: newUser.full_name,
                email: newUser.email,
                role: newUser.role,
                joinedDate: newUser.created_at.toISOString().split('T')[0],
                purchases: 0,
                lifetimeValue: 0
            };
        }

        return res.json({ status: true, message: 'Registration successful', token: result.token });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.json({ status: false, message: 'Internal server error' });
    }
}
