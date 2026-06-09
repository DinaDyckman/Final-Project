import Cart from '../models/cartModel';
import { Product } from '../models/productModel';

// Get cart with full product details
export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) return { userId, items: [] };
  return cart;
};

// Save entire cart (replaces existing)
export const saveCart = async (userId: string, items: { productId: string; quantity: number }[]) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { userId, items },
    { upsert: true, new: true }
  ).populate('items.productId');
  return cart;
};

// Clear cart after checkout
export const clearCart = async (userId: string) => {
  await Cart.findOneAndUpdate(
    { userId },
    { items: [] },
    { upsert: true, new: true }
  );
};