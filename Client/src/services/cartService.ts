import api from './api';
import { CartItem } from '../types';

export const cartService = {
  // Load cart from database
  getCart: async (): Promise<CartItem[]> => {
    try {
      const { data } = await api.get('/cart');
      // Convert DB format back to CartItem format
      return data.items?.map((item: any) => ({
        product: item.productId, // populated by mongoose
        quantity: item.quantity
      })) || [];
    } catch (error) {
      console.error('Failed to load cart from DB:', error);
      return [];
    }
  },

  // Save cart to database
  saveCart: async (cartItems: CartItem[]): Promise<void> => {
    try {
      const items = cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
      await api.post('/cart', { items });
    } catch (error) {
      console.error('Failed to save cart to DB:', error);
    }
  },

  // Clear cart in database
  clearCart: async (): Promise<void> => {
    try {
      await api.delete('/cart');
    } catch (error) {
      console.error('Failed to clear cart in DB:', error);
    }
  }
};