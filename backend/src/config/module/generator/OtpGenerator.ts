import crypto from 'crypto';

// Generate a 6-digit OTP
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Set OTP expiration time (10 minutes from now)
export function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000);
}


