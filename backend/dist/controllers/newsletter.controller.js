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
exports.subscribeToNewsletter = void 0;
const DataBase_1 = __importDefault(require("../design/DataBase"));
const schema_1 = require("../db/schema");
const logger_1 = __importDefault(require("../utils/logger"));
const subscribeToNewsletter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            res.status(400).json({ status: false, message: 'Valid email is required' });
            return;
        }
        const db = DataBase_1.default.getInstance().getDb();
        if (!db) {
            res.status(500).json({ status: false, message: 'Database not available' });
            return;
        }
        // Add subscriber
        try {
            yield db.insert(schema_1.newsletterSubscribers).values({ email });
            res.status(201).json({ status: true, message: 'Successfully subscribed to the newsletter' });
        }
        catch (dbError) {
            // Handle duplicate entry (ER_DUP_ENTRY for MySQL)
            if (dbError.code === 'ER_DUP_ENTRY' || dbError.message.includes('Duplicate')) {
                res.status(200).json({ status: true, message: 'You are already subscribed to the newsletter!' });
                return;
            }
            throw dbError; // rethrow to general catch
        }
    }
    catch (error) {
        logger_1.default.error('Error in newsletter subscription', { error: String(error) });
        res.status(500).json({ status: false, message: 'Internal server error while subscribing' });
    }
});
exports.subscribeToNewsletter = subscribeToNewsletter;
