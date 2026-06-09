import express, { Request, Response, NextFunction } from 'express';
import { registerNewUser } from '../services/userService';
import { sendVerificationEmail } from '../services/emailService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// --- Register ---
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await registerNewUser(req.body);
        res.status(201).json({
            success: true,
            data: { verificationRequired: true }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// --- Login: Direct authentication, no email verification ---
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            }
        });

    } catch (error) {
        next(error);
    }
});

// --- Verify Code: Only used for registration now ---
router.post('/verify-code', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'משתמש לא נמצא' });

        if (!user.verificationCode || user.verificationCode !== code)
            return res.status(400).json({ success: false, message: 'קוד שגוי' });

        if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date())
            return res.status(400).json({ success: false, message: 'קוד פג תוקף. נא להירשם מחדש.' });

        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            }
        });

    } catch (error) {
        next(error);
    }
});

// --- Contact Us ---
router.post('/contact', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, message } = req.body
        if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Missing required fields' })

        const { sendContactEmail } = await import('../services/emailService')
        await sendContactEmail({ name, email, phone, message })

        res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
})

export default router;