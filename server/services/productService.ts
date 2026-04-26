import { Product, IProduct } from '../models/productModel';

export const getAllProducts = async (): Promise<IProduct[]> => {
  const mongoose = require('mongoose');
  const docs = await mongoose.connection.db.collection('products').find({}).toArray();
  return docs as unknown as IProduct[];
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

// export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
//   const product = new Product(productData);
//   return await product.save();
// };

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  // Fix the image path automatically before saving to the DB
  if (productData.imageUrl && !productData.imageUrl.startsWith('/images/')) {
    productData.imageUrl = `/images/${productData.imageUrl}`;
  }

  const product = new Product(productData);
  return await product.save();
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};
