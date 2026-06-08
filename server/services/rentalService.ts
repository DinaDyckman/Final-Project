import Rental from '../models/rentalModel';
import { Product } from '../models/productModel';

export const createRental = async (rentalData: any) => {
  const { userId, items, startDate, endDate } = rentalData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  let finalPrice = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`מוצר עם מזהה ${item.productId} לא נמצא`);
    if (product.quantityAvailable < item.quantity) {
      throw new Error(`אין מספיק מלאי למוצר: ${product.name}. זמין כרגע: ${product.quantityAvailable}`);
    }
    const itemTotal = product.price * item.quantity * days;
    finalPrice += itemTotal;
    processedItems.push({
      productId: product._id,
      quantity: item.quantity,
      priceAtTimeOfRental: product.price
    });
    product.quantityAvailable -= item.quantity;
    await product.save();
  }

  const newRental = new Rental({
    userId,
    items: processedItems,
    startDate,
    endDate,
    totalPrice: finalPrice
  });

  return await newRental.save();
};

export const getRentalsByUser = async (userId: string) => {
  return await Rental.find({ userId }).populate('items.productId');
};

// ✅ NEW: Get all rentals for admin
export const getAllRentals = async () => {
  return await Rental.find({}).populate('items.productId').sort({ createdAt: -1 });
};

// ✅ NEW: Update rental status
export const updateRentalStatus = async (rentalId: string, status: string) => {
  return await Rental.findByIdAndUpdate(
    rentalId,
    { status },
    { new: true }
  ).populate('items.productId');
};