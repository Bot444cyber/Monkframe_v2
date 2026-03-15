import { object, string, number, TypeOf } from "zod";

export const loginSchema = object({
    body: object({
        email: string().email("Not a valid email"),
        password: string().min(6, "Password too short - should be 6 chars minimum"),
    }),
});

export const registerSchema = object({
    body: object({
        fullName: string().min(1, "Full name is required"),
        email: string().email("Not a valid email"),
        password: string().min(6, "Password too short - should be 6 chars minimum"),
        otp: number().or(string().transform(val => parseInt(val, 10))),
    }),
});

export const verifyOtpSchema = object({
    body: object({
        email: string().email("Not a valid email"),
        otp: number().optional().or(string().optional().transform(val => val ? parseInt(val, 10) : undefined)),
    }),
});

export type LoginInput = TypeOf<typeof loginSchema>;
export type RegisterInput = TypeOf<typeof registerSchema>;
export type VerifyOtpInput = TypeOf<typeof verifyOtpSchema>;
