import express, { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/cart — get current user's cart
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id || (req as any).user._id;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ message: 'Failed to get cart' });
  }
});

// POST /api/cart — save entire cart
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id || (req as any).user._id;
    const { items } = req.body;
    const cart = await cartService.saveCart(userId, items);
    res.json(cart);
  } catch (error: any) {
    console.error('Save cart error:', error.message);
    res.status(500).json({ message: 'Failed to save cart' });
  }
});

// DELETE /api/cart — clear cart
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id || (req as any).user._id;
    await cartService.clearCart(userId);
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

export default router;