import mongoose, { Schema } from 'mongoose';

const RentalSchema: Schema = new Schema({
  userId: { type: String, required: true }, 
  // המערך הזה מאפשר למשתמש לשכור כמה מוצרים שונים בבת אחת
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtTimeOfRental: { type: Number, required: true } // שומרים את המחיר למקרה שישתנה בעתיד
    }
  ],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Rental', RentalSchema);