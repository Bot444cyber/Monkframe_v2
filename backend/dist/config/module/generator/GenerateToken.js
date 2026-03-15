"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Configure environment variables
dotenv_1.default.config();
function GenerateToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable not set');
    }
    const Token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '12h',
        algorithm: 'HS256',
        issuer: 'Ticket-Management-System',
        audience: 'client-app'
    });
    return Token;
}
exports.default = GenerateToken;
