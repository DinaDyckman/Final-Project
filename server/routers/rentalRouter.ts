import express from 'express';
import * as rentalService from '../services/rentalService';

const router = express.Router();

/**
 * נתיב לביצוע Checkout
 * מקבל: userId, startDate, endDate, ומערך של items
 */
router.post('/checkout', async (req, res) => {
  try {
    const { userId, items, startDate, endDate } = req.body;

    // בדיקה שהנתונים הבסיסיים קיימים
    if (!userId || !items || !items.length || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Missing required fields: userId, items, startDate, or endDate are required." 
      });
    }

    // קריאה ל-Service לביצוע הלוגיקה (בדיקת מלאי, חישוב מחיר ושמירה)
    const newRental = await rentalService.createRental(req.body);

    res.status(201).json({
      message: "Rental placed successfully! 🎊",
      rental: newRental
    });
  } catch (error: any) {
    // אם ה-Service זרק שגיאה (למשל: אין מלאי), היא תיתפס כאן
    console.error("Checkout Error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 * קבלת היסטוריית השכרות של משתמש ספציפי
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const rentals = await rentalService.getRentalsByUser(req.params.userId);
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch rental history." });
  }
});

export default router;