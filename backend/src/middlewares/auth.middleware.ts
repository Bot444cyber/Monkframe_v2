import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check Passport Session
    if (req.isAuthenticated()) {
        return next();
    }

    // 2. Check JWT from Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is missing");
                return res.status(500).json({ status: false, message: "Server configuration error" });
            }

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to req.user (Mocking the structure expected by passport/controllers)
            // Controllers expect req.user.user_id
            req.user = {
                user_id: decoded.user_id || decoded.userId || decoded.id,
                email: decoded.email,
                role: decoded.role,
                full_name: decoded.full_name || decoded.name
            } as any;

            return next();
        } catch (error) {
            console.error("Token verification failed:", error);
            // Don't return yet? Or should we?
            // If token is present but invalid, sending 401 is correct.
            return res.status(401).json({ status: false, message: 'Invalid or expired token' });
        }
    }

    return res.status(401).json({ status: false, message: 'Unauthorized' });
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check Passport Session
    if (req.isAuthenticated()) {
        return next();
    }

    // 2. Check JWT from Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            if (process.env.JWT_SECRET) {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    user_id: decoded.user_id || decoded.userId || decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    full_name: decoded.full_name || decoded.name
                } as any;
            }
        } catch (error) {
            // Token invalid or expired - just proceed as guest
            // console.warn("Optional auth failed:", error); 
        }
    }

    // Proceed whether authenticated or not
    next();
};
