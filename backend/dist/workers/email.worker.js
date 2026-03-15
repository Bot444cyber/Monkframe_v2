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
exports.emailWorker = void 0;
const email_service_1 = __importDefault(require("../services/email.service"));
const emailWorker = (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, email, data } = job.data;
    console.log(`📧 Processing Email Job: ${type} for ${email}`);
    try {
        if (type === 'OTP') {
            yield (0, email_service_1.default)(email, data.otp);
        }
        // Add other types here
        return Promise.resolve();
    }
    catch (error) {
        console.error(`❌ Email Job Failed:`, error);
        throw error;
    }
});
exports.emailWorker = emailWorker;
