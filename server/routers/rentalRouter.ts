import express, { Request, Response } from 'express';
import * as rentalService from '../services/rentalService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/authorizationMiddleware';
import { sendRentalSummaryEmail } from '../services/emailService';
import User from '../models/userModel';

const router = express.Router();

router.post('/checkout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, items, startDate, endDate } = req.body;

    if (!userId || !items || !items.length || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newRental = await rentalService.createRental(req.body);

    // ✅ Send confirmation email
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        await sendRentalSummaryEmail(user.email, {
          id: newRental._id,
          itemName: `${items.length} פריטים`,
          startDate: new Date(startDate).toLocaleDateString('he-IL'),
          endDate: new Date(endDate).toLocaleDateString('he-IL'),
          totalPrice: newRental.totalPrice
        });
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the checkout if email fails
    }

    res.status(201).json({
      message: 'Rental placed successfully! 🎊',
      rental: newRental
    });
  } catch (error: any) {
    console.error('Checkout Error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get rentals for a specific user
router.get('/user/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const rentals = await rentalService.getRentalsByUser(req.params.userId);
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rental history.' });
  }
});

// ✅ Admin: get ALL rentals
router.get('/all', authMiddleware, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const rentals = await rentalService.getAllRentals();
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rentals.' });
  }
});

// ✅ Admin: update rental status
router.patch('/:id/status', authMiddleware, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const rental = await rentalService.updateRentalStatus(req.params.id, status);
    res.json(rental);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update rental status.' });
  }
});

export default router;