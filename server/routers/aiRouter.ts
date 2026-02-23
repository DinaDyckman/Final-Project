import express, { Request, Response } from 'express';
import { aiService } from '../services/aiService';

const router = express.Router();

/**
 * @route   POST /api/ai/consult
 * @desc    שליחת שאלה ל-Gemini ושמירת התשובה בבסיס הנתונים
 * @access  Public (או לפי הגדרות ה-Auth שלכן)
 */
router.post('/consult', async (req: Request, res: Response) => {
    console.log("!!! הבקשה הגיעה לשרת !!!", req.body);
    try {
        const { userId, userQuery } = req.body;

        // ולידציה בסיסית - לוודא שהגיעו נתונים מה-React
        if (!userId || !userQuery) {
            return res.status(400).json({ 
                message: "נא לשלוח מזהה משתמש ושאלה (userId & userQuery)" 
            });
        }

        // הפעלת הפונקציה מה-Service שמדברת עם Gemini
        const result = await aiService.generateAdvice(userId, userQuery);
        
        // החזרת האובייקט שנשמר ב-DB חלוזרה ל-React
        res.status(200).json(result);
    } catch (error: any) {
        console.error("Router Error:", error.message);
        res.status(500).json({ message: "שגיאה בתקשורת עם ה-AI" });
    }
});

/**
 * @route   GET /api/ai/history/:userId
 * @desc    שליפת כל היסטוריית הייעוץ של משתמשת מסוימת
 */
router.get('/history/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const history = await aiService.getUserHistory(userId);
        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ message: "לא הצלחנו לשלוף את ההיסטוריה" });
    }
});

export default router;