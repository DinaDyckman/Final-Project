process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ספרייה שמאפשרת ל-React לדבר עם השרת
import connectDB from './config/dbConfig';
import aiRouter from './routers/aiRouter';
import productRouter from './routers/productRouter';
import rentalRouter from './routers/rentalRouter';
import userRouter from './routers/userRouter';

// 1. טעינת משתני הסביבה (חייב להיות בהתחלה!)
dotenv.config();

// 2. אתחול האפליקציה
const app = express();

// 3. חיבור לבסיס הנתונים (הפונקציה שכתבנו ב-config/db.ts)
connectDB();

// 4. Middlewares
app.use(cors()); // מאפשר גישה מהדפדפן (React)
app.use(express.json()); // מאפשר לשרת לקבל נתונים בפורמט JSON

// 5. הגדרת הנתיבים (Routes)
// כל מה שקשור ל-AI יתחיל בכתובת /api/ai
app.use('/api/ai', aiRouter);
app.use('/api/products', productRouter);
app.use('/api/rentals', rentalRouter);
app.use('/api/users', userRouter);


// 6. בדיקת בריאות לשרת (אופציונלי - כדי לראות שהכל עובד)
app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

// 7. הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT} 🎈`);
});