"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyForgotPasswordOTP = exports.resetPassword = exports.forgotPasswordOTP = exports.register = exports.VerifyEmailByOTP = exports.login = void 0;
const Otp_1 = __importDefault(require("../design/Otp"));
const Auth_1 = require("../design/Auth");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const email_service_1 = __importStar(require("../services/email.service"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }
        // Authenticate user
        const loginResult = yield Auth_1.Auth.instance.login(email, password);
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
});
exports.login = login;
const VerifyEmailByOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email) {
            return res.json({ status: false, message: 'Email is required.' });
        }
        // If OTP is provided, verify it (Login 2nd Step)
        if (req.body.otp) {
            const verifyResult = yield Auth_1.Auth.instance.verifyOtp(req.body.email, req.body.otp);
            if (!verifyResult.status) {
                return res.json({ status: false, message: verifyResult.message });
            }
            return res.json({ status: true, message: 'OTP verified', token: verifyResult.token });
        }
        // Otherwise generate OTP (Registration/Forgot Password flow)
        const [existingEmail] = yield db_1.db.select().from(schema_1.authOtp).where((0, drizzle_orm_1.eq)(schema_1.authOtp.email, req.body.email)).limit(1);
        if (existingEmail) {
            const generatedOTP = yield Otp_1.default.SetupOTP(req.body.email);
            if (!generatedOTP) {
                return res.json({ status: false, message: 'OTP is not generated.' });
            }
            const [resp] = yield db_1.db.update(schema_1.authOtp)
                .set({
                otp: parseInt(generatedOTP),
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.authOtp.email, req.body.email));
            if (resp.affectedRows === 0) { // mysql2 return format check if needed
                return res.json({ status: false, message: 'Unable to update otp.' });
            }
            // Send OTP Email directly
            yield (0, email_service_1.default)(req.body.email, generatedOTP);
            return res.json({ status: true, message: 'OTP is updated.' });
        }
        const [existingUserCheck] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, req.body.email)).limit(1);
        if (existingUserCheck) {
            return res.json({ status: false, message: 'User already registered.' });
        }
        const generatedOTP = yield Otp_1.default.SetupOTP(req.body.email);
        if (!generatedOTP) {
            return res.json({ status: false, message: 'OTP is not generated.' });
        }
        const [response] = yield db_1.db.insert(schema_1.authOtp).values({
            email: req.body.email,
            otp: parseInt(generatedOTP)
        });
        if (response.affectedRows === 0) {
            return res.json({ status: true, message: 'Failed to insert data.' });
        }
        // Send OTP Email directly
        yield (0, email_service_1.default)(req.body.email, generatedOTP);
        // Return the otp success message...
        return res.json({ status: true, message: 'OTP is generated.', data: generatedOTP });
    }
    catch (error) {
        console.log("Error :- ", error);
        return res.json({ status: false, message: 'Internal Server Issue' });
    }
});
exports.VerifyEmailByOTP = VerifyEmailByOTP;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName, otp } = req.body;
        if (!email || !password || !fullName || !otp) {
            return res.json({ status: false, message: 'All fields are required' });
        }
        const result = yield Auth_1.Auth.instance.register(email, password, fullName, otp);
        if (!result.status) {
            return res.json({ status: false, message: result.message });
        }
        // Fetch the user object to emit (optional, but good for UI)
        const [newUser] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
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
        // Send Welcome Email
        yield (0, email_service_1.sendWelcomeEmail)(email, fullName);
        return res.json({ status: true, message: 'Registration successful', token: result.token });
    }
    catch (error) {
        console.error('Error during registration:', error);
        return res.json({ status: false, message: 'Internal server error' });
    }
});
exports.register = register;
const forgotPasswordOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: false, message: 'Email is required' });
        }
        // Check if user exists
        const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User with this email does not exist' });
        }
        // Generate and Send OTP
        const generatedOTP = yield Otp_1.default.SetupOTP(email);
        if (!generatedOTP) {
            return res.status(500).json({ status: false, message: 'Failed to generate OTP' });
        }
        // Update or Insert OTP in authOtp table
        const [existingOtp] = yield db_1.db.select().from(schema_1.authOtp).where((0, drizzle_orm_1.eq)(schema_1.authOtp.email, email)).limit(1);
        if (existingOtp) {
            yield db_1.db.update(schema_1.authOtp)
                .set({ otp: parseInt(generatedOTP), updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.authOtp.email, email));
        }
        else {
            yield db_1.db.insert(schema_1.authOtp).values({
                email,
                otp: parseInt(generatedOTP)
            });
        }
        // Send OTP via Email (Forgot Password context)
        yield (0, email_service_1.default)(email, generatedOTP, true);
        return res.json({ status: true, message: 'OTP sent successfully to your email' });
    }
    catch (error) {
        console.error('Error during forgot password OTP:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
});
exports.forgotPasswordOTP = forgotPasswordOTP;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }
        const result = yield Auth_1.Auth.instance.resetPassword(email, parseInt(otp), newPassword);
        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }
        // Send Password Change Success Email
        yield (0, email_service_1.sendPasswordChangeSuccessEmail)(email);
        return res.json({ status: true, message: result.message });
    }
    catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;
const verifyForgotPasswordOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ status: false, message: 'Email and OTP are required' });
        }
        const isValid = yield Otp_1.default.isValidOTP(email, parseInt(otp));
        if (!isValid) {
            return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
        }
        return res.json({ status: true, message: 'OTP verified successfully' });
    }
    catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
});
exports.verifyForgotPasswordOTP = verifyForgotPasswordOTP;
