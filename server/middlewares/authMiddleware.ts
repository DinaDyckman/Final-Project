import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret_key';        
        const decoded = jwt.verify(token, secret) as any;
        
        (req as any).user = decoded;
        
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};