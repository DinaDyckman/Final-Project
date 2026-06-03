import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// --- תהליך 1: הרשמה (Register) ---
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. בדיקה אם המשתמש כבר קיים במערכת
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'האימייל כבר קיים במערכת' });
        }

        // 2. הצפנת הסיסמה (אבטחה)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. שמירת המשתמש החדש
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: 'המשתמש נרשם בהצלחה!' 
        });

    } catch (error) {
        next(error); // מעביר את השגיאה ל-errorHandler של מירי
    }
});

// --- תהליך 2: התחברות (Login) ---
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // 1. חיפוש המשתמש לפי אימייל
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
        }

        // 2. בדיקת הסיסמה (השוואה לסיסמה המוצפנת)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
        }

        // 3. יצירת טוקן מאובטח (JWT) עבור הדפדפן
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. החזרת מידע ל-React
        res.status(200).json({
            success: true,
            message: 'התחברת בהצלחה!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

export default router;