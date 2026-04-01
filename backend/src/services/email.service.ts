import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { welcomeTemplate } from './Email/welcome.template';
import { otpTemplate } from './Email/otp.template';
import { passwordChangeTemplate } from './Email/password-change.template';
import { paymentSuccessTemplate } from './Email/payment-success.template';

// Load environment variables from .env file
dotenv.config();

// Define interface for email options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Creates and returns the nodemailer transport
 */
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_TOKKEN,
    },
  });
}

const DEFAULT_FROM = '"Monkframer | UI/UX" <noreply@www.mockupidea.com>';

/**
 * Sends a professional OTP email with the Monkframer branding.
 * @param userEmail Recipient email address
 * @param otp The 6-digit OTP code
 * @param isForgotPassword Whether this is for a password reset
 * @returns boolean indicating success
 */
export async function sendOTPEmail(userEmail: string, otp: string | number, isForgotPassword = false): Promise<boolean> {
  if (!userEmail || !otp) {
    console.error('❌ Email and OTP are required');
    return false;
  }

  try {
    const transport = createTransport();
    const subject = isForgotPassword ? 'Reset Your Password | Monkframer' : 'Your Verification Code | Monkframer';
    const html = otpTemplate(otp.toString(), isForgotPassword);

    const mailOptions: MailOptions = {
      from: DEFAULT_FROM,
      to: userEmail,
      subject,
      text: `Your verification code is ${otp}`,
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ OTP Email sent:', info.messageId);
    return true;
  } catch (error: unknown) {
    console.error('❌ Error sending OTP email:', error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Sends a warm Welcome email to new users.
 */
export async function sendWelcomeEmail(userEmail: string, name: string): Promise<boolean> {
  if (!userEmail || !name) {
    console.error('❌ Email and Name are required');
    return false;
  }

  try {
    const transport = createTransport();
    const html = welcomeTemplate(name);

    const mailOptions: MailOptions = {
      from: DEFAULT_FROM,
      to: userEmail,
      subject: 'Welcome to Monkframer | Premium UI/UX',
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Welcome Email sent:', info.messageId);
    return true;
  } catch (error: unknown) {
    console.error('❌ Error sending welcome email:', error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Sends a notification after a successful password change.
 */
export async function sendPasswordChangeSuccessEmail(userEmail: string): Promise<boolean> {
  if (!userEmail) {
    console.error('❌ Email is required');
    return false;
  }

  try {
    const transport = createTransport();
    const html = passwordChangeTemplate();

    const mailOptions: MailOptions = {
      from: DEFAULT_FROM,
      to: userEmail,
      subject: 'Security Alert: Password Changed | Monkframer',
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Password Change Success Email sent:', info.messageId);
    return true;
  } catch (error: unknown) {
    console.error('❌ Error sending password change success email:', error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Sends a payment success receipt to the user.
 */
export async function sendPaymentSuccessEmail(userEmail: string, details: { orderId: string, amount: string, date: string, planName: string }): Promise<boolean> {
  if (!userEmail || !details) {
    console.error('❌ Email and Details are required');
    return false;
  }

  try {
    const transport = createTransport();
    const html = paymentSuccessTemplate(details);

    const mailOptions: MailOptions = {
      from: DEFAULT_FROM,
      to: userEmail,
      subject: 'Payment Successful | Monkframer Receipt',
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Payment Success Email sent:', info.messageId);
    return true;
  } catch (error: unknown) {
    console.error('❌ Error sending payment success email:', error instanceof Error ? error.message : error);
    return false;
  }
}

export default sendOTPEmail;
