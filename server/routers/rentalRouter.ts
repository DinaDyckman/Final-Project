import express, { Request, Response } from 'express';
import * as rentalService from '../services/rentalService';

const router = express.Router();

router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { userId, items, startDate, endDate } = req.body;

    if (!userId || !items || !items.length || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields: userId, items, startDate, or endDate are required.' });
    }

    const newRental = await rentalService.createRental(req.body);

    res.status(201).json({
      message: 'Rental placed successfully! ',
      rental: newRental
    });
  } catch (error: any) {
    console.error('Checkout Error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const rentals = await rentalService.getRentalsByUser(req.params.userId);
    res.json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rental history.' });
  }
});

export default router;