"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
// Endpoint for newsletter subscriptions
router.post('/subscribe', rateLimit_middleware_1.generalLimiter, newsletter_controller_1.subscribeToNewsletter);
exports.default = router;
