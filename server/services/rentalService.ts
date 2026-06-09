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
  return await Rental.find({ userId }).populate('items.productId').sort({ createdAt: -1 });
};

export const getAllRentals = async () => {
  return await Rental.find({}).populate('items.productId').sort({ createdAt: -1 });
};

export const updateRentalStatus = async (rentalId: string, status: string) => {
  return await Rental.findByIdAndUpdate(
    rentalId,
    { status },
    { new: true }
  ).populate('items.productId');
};

// ✅ Feature 5: Mark as returned — restores product quantities
export const markAsReturned = async (rentalId: string) => {
  const rental = await Rental.findById(rentalId).populate('items.productId');
  if (!rental) throw new Error('Rental not found');
  if (rental.status === 'completed') throw new Error('Rental already marked as returned');

  // Restore quantity for each product
  for (const item of (rental.items as any[])) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.quantityAvailable += item.quantity;
      await product.save();
    }
  }

  rental.status = 'completed';
  return await rental.save();
};

// ✅ Feature 8: Cancel order — only if pending, restores quantities
export const cancelRental = async (rentalId: string, userId: string) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) throw new Error('Rental not found');
  if (rental.userId !== userId) throw new Error('Unauthorized');
  if (rental.status !== 'pending') throw new Error('Only pending orders can be cancelled');

  for (const item of (rental.items as any[])) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.quantityAvailable += item.quantity;
      await product.save();
    }
  }

  rental.status = 'completed';
  await rental.save();

  return rental;
};