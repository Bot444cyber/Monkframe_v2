import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { welcomeTemplate } from './Email/welcome.template';
import { otpTemplate } from './Email/otp.template';
import { passwordChangeTemplate } from './Email/password-change.template';
import { paymentSuccessTemplate } from './Email/payment-success.template';

import path from 'path';

// Load environment variables from .env file
dotenv.config();

const LOGO_PATH = path.join(__dirname, '../../public/logo/M_SHAPE.svg');

// Define interface for attachment
interface Attachment {
  filename: string;
  path: string;
  cid: string;
}

// Define interface for email options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
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

const DEFAULT_FROM = '"Mockupidea | UI/UX" <noreply@www.mockupidea.com>';

const DEFAULT_LOGO_ATTACHMENT = {
  filename: 'M_SHAPE.svg',
  path: LOGO_PATH,
  cid: 'logo_id'
};

/**
 * Sends a professional OTP email with the Mockupidea branding.
 */
export async function sendOTPEmail(userEmail: string, otp: string | number, isForgotPassword = false): Promise<boolean> {
  if (!userEmail || !otp) {
    console.error('❌ Email and OTP are required');
    return false;
  }

  try {
    const transport = createTransport();
    const subject = isForgotPassword ? 'Reset Your Password | Mockupidea' : 'Your Verification Code | Mockupidea';
    const html = otpTemplate(otp.toString(), isForgotPassword);

    const mailOptions: MailOptions = {
      from: DEFAULT_FROM,
      to: userEmail,
      subject,
      text: `Your verification code is ${otp}`,
      html,
      attachments: [DEFAULT_LOGO_ATTACHMENT]
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
      subject: 'Welcome to Mockupidea | Premium Design Assets',
      html,
      attachments: [DEFAULT_LOGO_ATTACHMENT]
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
      subject: 'Security Alert: Password Changed | Mockupidea',
      html,
      attachments: [DEFAULT_LOGO_ATTACHMENT]
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
      subject: 'Payment Successful | Mockupidea Receipt',
      html,
      attachments: [DEFAULT_LOGO_ATTACHMENT]
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
