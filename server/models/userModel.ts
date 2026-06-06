import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'נא להזין שם מלא'] 
    },
    email: { 
        type: String, 
        required: [true, 'נא להזין אימייל'], 
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'נא להזין אימייל תקין']
    },
    password: { 
        type: String, 
        required: [true, 'נא להזין סיסמה'] 
    },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], 
        default: 'User' 
    },
    // 🔥 שדות חדשים עבור קוד האימות במייל
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);