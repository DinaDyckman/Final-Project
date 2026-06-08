import express, { Request, Response } from 'express';
import * as rentalService from '../services/rentalService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/authorizationMiddleware';
import { sendRentalSummaryEmail } from '../services/emailService';
import User from '../models/userModel';
import Rental from '../models/rentalModel';
import { Product } from '../models/productModel';

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/rentals/checkout
// ─────────────────────────────────────────────
router.post('/checkout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, items, startDate, endDate } = req.body;

    if (!userId || !items || !items.length || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newRental = await rentalService.createRental(req.body);

    // Send confirmation email
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

// ─────────────────────────────────────────────
// GET /api/rentals/my-rentals
// Returns rentals for the currently logged-in user (from JWT token via authMiddleware).
// authMiddleware must attach the decoded user to req.user (e.g. req.user._id or req.user.id).
// ─────────────────────────────────────────────
router.get('/my-rentals', authMiddleware, async (req: Request, res: Response) => {
  try {
    // authMiddleware should attach decoded token payload to req.user
    const userId = (req as any).user?._id || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user not found in token.' });
    }
    const rentals = await Rental.find({ userId })
      .populate('items.productId', 'name imageUrl price category')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch your rental history.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/rentals/user/:userId
// ─────────────────────────────────────────────
router.get('/user/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const rentals = await rentalService.getRentalsByUser(req.params.userId);
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rental history.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/rentals/all  (Admin only)
// ─────────────────────────────────────────────
router.get('/all', authMiddleware, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const rentals = await rentalService.getAllRentals();
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rentals.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/rentals/:id/status  (Admin only)
// ─────────────────────────────────────────────
router.patch('/:id/status', authMiddleware, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const rental = await rentalService.updateRentalStatus(req.params.id, status);
    res.json(rental);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update rental status.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/rentals/:id/return  (Admin only)
// Marks a rental as 'completed' AND restores each product's quantityAvailable.
// ─────────────────────────────────────────────
router.patch('/:id/return', authMiddleware, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found.' });
    }

    if (rental.status === 'completed') {
      return res.status(400).json({ message: 'Rental is already marked as completed.' });
    }

    // Restore inventory: loop through each rented item and add quantity back
    for (const item of rental.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantityAvailable: item.quantity } },
        { new: true }
      );
    }

    // Mark rental as completed
    rental.status = 'completed';
    await rental.save();

    res.json({
      message: 'Rental marked as returned. Inventory restored.',
      rental
    });
  } catch (error: any) {
    console.error('markAsReturned Error:', error.message);
    res.status(500).json({ message: 'Failed to mark rental as returned.' });
  }
});

export default router;