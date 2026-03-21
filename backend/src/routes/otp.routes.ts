import express from "express";
import * as AuthController from "../controllers/auth.controller";
import validateResource from "../middlewares/validateResource";
import { loginSchema, registerSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/auth.schema";

const router = express.Router();

// Auth Route
router.post('/auth/login', validateResource(loginSchema), AuthController.login);
router.post('/auth/otp', validateResource(verifyOtpSchema), AuthController.VerifyEmailByOTP);
router.post('/auth/register', validateResource(registerSchema), AuthController.register);

// Forgot Password
router.post('/auth/forgot-password/otp', validateResource(forgotPasswordSchema), AuthController.forgotPasswordOTP);
router.post('/auth/forgot-password/reset', validateResource(resetPasswordSchema), AuthController.resetPassword);

export default router;
