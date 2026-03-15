"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.getOTPExpiry = getOTPExpiry;
const crypto_1 = __importDefault(require("crypto"));
// Generate a 6-digit OTP
function generateOTP() {
    return crypto_1.default.randomInt(100000, 999999).toString();
}
// Set OTP expiration time (10 minutes from now)
function getOTPExpiry() {
    return new Date(Date.now() + 10 * 60 * 1000);
}
