"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/create-payment-intent', auth_middleware_1.authenticateUser, payment_controller_1.createPaymentIntent);
router.post('/confirm-payment', auth_middleware_1.authenticateUser, payment_controller_1.confirmPayment);
exports.default = router;
