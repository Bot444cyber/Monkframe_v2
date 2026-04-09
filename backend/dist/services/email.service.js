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
exports.sendOTPEmail = sendOTPEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendPasswordChangeSuccessEmail = sendPasswordChangeSuccessEmail;
exports.sendPaymentSuccessEmail = sendPaymentSuccessEmail;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const welcome_template_1 = require("./Email/welcome.template");
const otp_template_1 = require("./Email/otp.template");
const password_change_template_1 = require("./Email/password-change.template");
const payment_success_template_1 = require("./Email/payment-success.template");
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config();
const LOGO_PATH = path_1.default.join(__dirname, '../../public/logo/M_SHAPE.svg');
/**
 * Creates and returns the nodemailer transport
 */
function createTransport() {
    return nodemailer_1.default.createTransport({
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
function sendOTPEmail(userEmail_1, otp_1) {
    return __awaiter(this, arguments, void 0, function* (userEmail, otp, isForgotPassword = false) {
        if (!userEmail || !otp) {
            console.error('❌ Email and OTP are required');
            return false;
        }
        try {
            const transport = createTransport();
            const subject = isForgotPassword ? 'Reset Your Password | Mockupidea' : 'Your Verification Code | Mockupidea';
            const html = (0, otp_template_1.otpTemplate)(otp.toString(), isForgotPassword);
            const mailOptions = {
                from: DEFAULT_FROM,
                to: userEmail,
                subject,
                text: `Your verification code is ${otp}`,
                html,
                attachments: [DEFAULT_LOGO_ATTACHMENT]
            };
            const info = yield transport.sendMail(mailOptions);
            console.log('✅ OTP Email sent:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Error sending OTP email:', error instanceof Error ? error.message : error);
            return false;
        }
    });
}
/**
 * Sends a warm Welcome email to new users.
 */
function sendWelcomeEmail(userEmail, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail || !name) {
            console.error('❌ Email and Name are required');
            return false;
        }
        try {
            const transport = createTransport();
            const html = (0, welcome_template_1.welcomeTemplate)(name);
            const mailOptions = {
                from: DEFAULT_FROM,
                to: userEmail,
                subject: 'Welcome to Mockupidea | Premium Design Assets',
                html,
                attachments: [DEFAULT_LOGO_ATTACHMENT]
            };
            const info = yield transport.sendMail(mailOptions);
            console.log('✅ Welcome Email sent:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Error sending welcome email:', error instanceof Error ? error.message : error);
            return false;
        }
    });
}
/**
 * Sends a notification after a successful password change.
 */
function sendPasswordChangeSuccessEmail(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail) {
            console.error('❌ Email is required');
            return false;
        }
        try {
            const transport = createTransport();
            const html = (0, password_change_template_1.passwordChangeTemplate)();
            const mailOptions = {
                from: DEFAULT_FROM,
                to: userEmail,
                subject: 'Security Alert: Password Changed | Mockupidea',
                html,
                attachments: [DEFAULT_LOGO_ATTACHMENT]
            };
            const info = yield transport.sendMail(mailOptions);
            console.log('✅ Password Change Success Email sent:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Error sending password change success email:', error instanceof Error ? error.message : error);
            return false;
        }
    });
}
/**
 * Sends a payment success receipt to the user.
 */
function sendPaymentSuccessEmail(userEmail, details) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail || !details) {
            console.error('❌ Email and Details are required');
            return false;
        }
        try {
            const transport = createTransport();
            const html = (0, payment_success_template_1.paymentSuccessTemplate)(details);
            const mailOptions = {
                from: DEFAULT_FROM,
                to: userEmail,
                subject: 'Payment Successful | Mockupidea Receipt',
                html,
                attachments: [DEFAULT_LOGO_ATTACHMENT]
            };
            const info = yield transport.sendMail(mailOptions);
            console.log('✅ Payment Success Email sent:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Error sending payment success email:', error instanceof Error ? error.message : error);
            return false;
        }
    });
}
exports.default = sendOTPEmail;
