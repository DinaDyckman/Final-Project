import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'נא להזין שם משתמש'] 
    },
    email: { 
        type: String, 
        required: [true, 'נא להזין אימייל'], 
        unique: true, 
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, 'נא להזין סיסמה'] 
    },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], 
        default: 'User' 
    }
}, { timestamps: true });

const User = model('User', userSchema);
export default User;