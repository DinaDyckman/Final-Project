import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { sendVerificationEmail } from './emailService';

export const registerNewUser = async (userData: any) => {
    const { name, email, password, role, adminCode } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('האימייל כבר קיים במערכת');

    let finalRole = 'User';
    if (role === 'Admin') {
        if (adminCode !== 'AdminPassword2026') throw new Error('קוד מנהל שגוי!');
        finalRole = 'Admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: finalRole,
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    await newUser.save();
    await sendVerificationEmail(email, code);

    return { verificationRequired: true };
};
