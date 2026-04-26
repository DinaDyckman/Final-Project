//חיבור למונגו
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// טעינת משתני סביבה (כמו כתובת ה-DB) מקובץ ה-.env
dotenv.config();
const connectDB = async (): Promise<void> => {
    try {
        //const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventInventory';
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://numi-dina:7nmyCER4P8zq.pq@project.j8malzx.mongodb.net/?appName=project';
        await mongoose.connect(mongoURI);
        
        console.log('MongoDB Connected Successfully! 🚀');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // סגירת התהליך אם החיבור נכשל (חשוב בשרת)
        process.exit(1);
    }
};
export default connectDB;