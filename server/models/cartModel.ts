import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 }
}, { _id: false });

const CartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);