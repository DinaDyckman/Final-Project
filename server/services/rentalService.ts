import Rental from '../models/rentalModel';
import { Product } from '../models/productModel';

export const createRental = async (rentalData: any) => {
  const { userId, items, startDate, endDate } = rentalData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  let finalPrice = 0;
  const processedItems = [];

  // עוברים על כל פריט שהמשתמש הוסיף לעגלה
  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product) throw new Error(`מוצר עם מזהה ${item.productId} לא נמצא`);
    
    if (product.quantityAvailable < item.quantity) {
      throw new Error(`אין מספיק מלאי למוצר: ${product.name}. זמין כרגע: ${product.quantityAvailable}`);
    }

    // חישוב מחיר לפריט הספציפי כפול ימים
    const itemTotal = product.price * item.quantity * days;
    finalPrice += itemTotal;

    // שמירה של הפריט עם המחיר שלו ברגע הרכישה
    processedItems.push({
      productId: product._id,
      quantity: item.quantity,
      priceAtTimeOfRental: product.price
    });

    // עדכון מלאי: מורידים מהמלאי את הכמות שנשכרה
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
