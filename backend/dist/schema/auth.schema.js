"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)().email("Not a valid email"),
        password: (0, zod_1.string)().min(6, "Password too short - should be 6 chars minimum"),
    }),
});
exports.registerSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        fullName: (0, zod_1.string)().min(1, "Full name is required"),
        email: (0, zod_1.string)().email("Not a valid email"),
        password: (0, zod_1.string)().min(6, "Password too short - should be 6 chars minimum"),
        otp: (0, zod_1.number)().or((0, zod_1.string)().transform(val => parseInt(val, 10))),
    }),
});
exports.verifyOtpSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)().email("Not a valid email"),
        otp: (0, zod_1.number)().optional().or((0, zod_1.string)().optional().transform(val => val ? parseInt(val, 10) : undefined)),
    }),
});
