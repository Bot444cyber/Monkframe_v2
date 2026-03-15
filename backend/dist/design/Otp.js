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
Object.defineProperty(exports, "__esModule", { value: true });
const OtpGenerator_1 = require("../config/module/generator/OtpGenerator");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class OTP {
    SetupOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // OTP generation and expiry setup
                const GenratedOTP = (0, OtpGenerator_1.generateOTP)();
                const OTPExpiry = (0, OtpGenerator_1.getOTPExpiry)();
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
        });
    }
    isValidOTP(email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !OTP) {
                console.error("Email and OTP are required for validation");
                return false;
            }
            try {
                const [record] = yield db_1.db.select().from(schema_1.authOtp).where((0, drizzle_orm_1.eq)(schema_1.authOtp.email, email)).limit(1);
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
        });
    }
}
exports.default = new OTP();
