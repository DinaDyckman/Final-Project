import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  quantityAvailable: number;
  imageUrl?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantityAvailable: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);