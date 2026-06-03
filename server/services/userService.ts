import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// 1. לוגיקת הרשמה
export const registerNewUser = async (userData: any) => {
    // הוספנו קבלה של adminCode מהבקשה
    const { name, email, password, role, adminCode } = userData;

    // 1. בדיקה אם המשתמש קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('האימייל כבר קיים במערכת');
    }

    // 2. בדיקת אבטחה עבור תפקיד אדמין
    let finalRole = 'User'; // ברירת מחדל בטוחה
    
    if (role === 'Admin') {
        // כאן את מגדירה את הסיסמה הסודית שרק את והצוות מכירים!
        const CORRECT_ADMIN_CODE = 'AdminPassword2026'; 
        
        if (adminCode !== CORRECT_ADMIN_CODE) {
            throw new Error('קוד מנהל שגוי! אינך מורשה להירשם כמנהל מערכת.');
        }
        finalRole = 'Admin';
    }

    // 3. הצפנת הסיסמה
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. יצירה ושמירה ב-DB
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: finalRole // משתמש בתפקיד המאומת
    });

    return await newUser.save();
};