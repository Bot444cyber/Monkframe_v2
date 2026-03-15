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
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
// Load environment variables from .env file
dotenv_1.default.config();
// OAuth2 configuration
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN_GMAIL;
const EMAIL_USER = process.env.EMAIL_USER;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
/**
 * Sends a professional OTP email with the Railway Reservation System branding.
 * @param userEmail Recipient email address
 * @param otp The 6-digit OTP code
 * @returns boolean indicating success
 */
function sendOTPEmail(userEmail, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail || !otp) {
            console.error('❌ Email and OTP are required');
            return false;
        }
        try {
            const accessTokenResponse = yield oAuth2Client.getAccessToken();
            const accessToken = accessTokenResponse.token;
            if (!accessToken) {
                throw new Error('Failed to generate access token');
            }
            const transport = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: EMAIL_USER,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });
            const mailOptions = {
                from: `Railway Reservation System <${EMAIL_USER}>`,
                to: userEmail,
                subject: 'Your Verification Code',
                text: `Your verification code is ${otp}`,
                html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Railway Reservation System verification</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          background-color: #f4f6f8; /* Light gray background */
          font-family: 'Roboto', Arial, sans-serif;
          color: #333333;
          -webkit-font-smoothing: antialiased;
        }
        
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 40px 20px;
        }
        
        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Subtle shadow for professional look */
          overflow: hidden;
          text-align: center;
        }
        
        .header {
          padding: 30px 0;
          background: #2c3e50; /* Dark header for contrast */
        }
        
        .brand-text {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        h2 {
          margin: 0 0 15px 0;
          font-size: 22px;
          font-weight: 500;
          color: #2c3e50;
        }
        
        p {
          margin: 0 0 25px 0;
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
        }
        
        .otp-box {
          display: inline-block;
          background: #ebf5ff; /* Light blue background */
          border: 2px solid #3b82f6; /* Blue border */
          color: #1d4ed8; /* Darker blue text */
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 5px;
          padding: 20px 50px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .warning-text {
          font-size: 14px;
          color: #7f8c8d;
          max-width: 80%;
          margin: 0 auto;
        }

        .footer {
          padding: 20px;
          border-top: 1px solid #eeeeee;
          background: #fafafa;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body style="background-color: #f4f6f8;">
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="brand-text">Railway Reservation System</div>
          </div>
          
          <div class="content">
            <h2>Authentication Required</h2>
            <p>Please use the verification code below to securely sign in to your account.</p>
            
            <div class="otp-box">${otp}</div>
            
            <p class="warning-text">This code will expire in 10 minutes.<br>If you did not request this, please ignore this email.</p>
          </div>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} Railway Reservation System. All rights reserved.<br>
            Please do not reply to this automated message.
          </div>
        </div>
      </div>
    </body>
    </html>
    `
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
exports.default = sendOTPEmail;
