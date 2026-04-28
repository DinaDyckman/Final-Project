import express from 'express';
import * as productService from '../services/productService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await productService.deleteProduct(req.params.id as string);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export default router;
