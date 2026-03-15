import sendOTPEmail from '../services/email.service';
import { generateOTP, getOTPExpiry } from '../config/module/generator/OtpGenerator';
import { db } from '../db';
import { authOtp } from '../db/schema';
import { eq } from 'drizzle-orm';

class OTP {
    async SetupOTP(email: string) {
        try {
            // OTP generation and expiry setup
            const GenratedOTP = generateOTP();
            const OTPExpiry = getOTPExpiry();
            if (!GenratedOTP || !OTPExpiry) {
                console.error("Failed to generate OTP or set expiry");
                return false;
            }

            // Return OTP without sending email (Controller handles queue)
            return GenratedOTP;
        }
        catch (error) {
            console.log("Error setting up OTP:", error);
            return false;
        }
    }

    async isValidOTP(email: string, OTP: any) {
        if (!email || !OTP) {
            console.error("Email and OTP are required for validation");
            return false;
        }

        try {
            const [record] = await db.select().from(authOtp).where(eq(authOtp.email, email)).limit(1);

            if (!record) {
                return false;
            }

            // Check if OTP matches
            if (record.otp !== parseInt(OTP)) {
                return false;
            }

            // Optional: Check expiry if createdAt/updatedAt is too old (e.g. 10 mins)
            // For now, simple check
            return true;
        }
        catch (error) {
            console.error("Error validating OTP:", error);
            return false;
        }
    }
}

export default new OTP();