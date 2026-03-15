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
exports.Auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Otp_1 = __importDefault(require("./Otp"));
const GenerateToken_1 = __importDefault(require("../config/module/generator/GenerateToken"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class Auth {
    constructor() {
        // Default Constructor
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    return { status: false, message: "Email and password are required" };
                }
                const user = yield db_1.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.email, email)
                });
                if (!user) {
                    return { status: false, message: "User not found" };
                }
                // Verify HashedPassword
                if (!user.password_hash) {
                    return { status: false, message: "Invalid credentials" };
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password_hash);
                if (!isPasswordValid) {
                    return { status: false, message: "Invalid password" };
                }
                // Get User Data
                const tokenData = {
                    full_name: user.full_name || '',
                    role: user.role,
                    user_id: user.user_id,
                    email: user.email
                };
                // Return Token
                return { status: true, message: "Login successful", token: (0, GenerateToken_1.default)(tokenData) };
            }
            catch (error) {
                console.error(`Login failed: ${error}`);
                return { status: false, message: "Internal server error" };
            }
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = yield Otp_1.default.isValidOTP(email, otp);
                if (!isValid) {
                    return { status: false, message: "Invalid or expired OTP" };
                }
                const user = yield db_1.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.email, email)
                });
                if (!user) {
                    return { status: false, message: "User not found" };
                }
                // Get User Data
                const tokenData = {
                    full_name: user.full_name || '',
                    role: user.role,
                    user_id: user.user_id,
                    email: user.email
                };
                // Return Token
                return { status: true, message: "Login successful", token: (0, GenerateToken_1.default)(tokenData) };
            }
            catch (error) {
                console.error(`OTP verification failed: ${error}`);
                return { status: false, message: "Internal server error" };
            }
        });
    }
    register(email, password, fullName, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify OTP first
                const isValid = yield Otp_1.default.isValidOTP(email, otp);
                if (!isValid) {
                    return { status: false, message: "Invalid or expired OTP" };
                }
                // Check if user already exists (double check)
                const existingUser = yield db_1.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.email, email)
                });
                if (existingUser) {
                    return { status: false, message: "User already exists" };
                }
                // Hash password
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                // Create User
                yield db_1.db.insert(schema_1.users).values({
                    email,
                    password_hash: passwordHash,
                    full_name: fullName,
                    role: 'CUSTOMER' // Default role
                });
                const newUser = yield db_1.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.email, email)
                });
                if (!newUser) {
                    return { status: false, message: "Failed to create user" };
                }
                // Get User Data
                const tokenData = {
                    full_name: newUser.full_name || '',
                    role: newUser.role,
                    user_id: newUser.user_id,
                    email: newUser.email
                };
                // Return Token
                return { status: true, message: "Registration successful", token: (0, GenerateToken_1.default)(tokenData) };
            }
            catch (error) {
                console.error(`Registration failed: ${error}`);
                return { status: false, message: "Internal server error" };
            }
        });
    }
}
exports.Auth = Auth;
Auth.instance = new Auth();
