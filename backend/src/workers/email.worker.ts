
import { Job } from 'bull';
import sendOTPEmail from '../services/email.service';

interface EmailJobData {
    type: 'OTP' | 'WELCOME';
    email: string;
    data: any;
}

export const emailWorker = async (job: Job<EmailJobData>) => {
    const { type, email, data } = job.data;
    console.log(`📧 Processing Email Job: ${type} for ${email}`);

    try {
        if (type === 'OTP') {
            await sendOTPEmail(email, data.otp);
        }
        // Add other types here
        return Promise.resolve();
    } catch (error) {
        console.error(`❌ Email Job Failed:`, error);
        throw error;
    }
};
