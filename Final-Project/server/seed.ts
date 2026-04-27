import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/productModel';

dotenv.config();

const products = [
  // Event Furniture
  { name: 'Round Banquet Table', category: 'Tables', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rectangular Folding Table', category: 'Tables', quantityAvailable: 30, imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cocktail Table', category: 'Tables', quantityAvailable: 15, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chiavari Chair', category: 'Chairs', quantityAvailable: 200, imageUrl: 'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?auto=format&fit=crop&w=400&q=80' },
  { name: 'Folding Chair', category: 'Chairs', quantityAvailable: 300, imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80' },
  { name: 'Throne Chair', category: 'Chairs', quantityAvailable: 2, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Lounge Sofa', category: 'Sofas', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ottoman', category: 'Lounge Furniture', quantityAvailable: 12, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80' },

  // Decor
  { name: 'Floral Centerpiece', category: 'Centerpieces', quantityAvailable: 40, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780780169993?auto=format&fit=crop&w=400&q=80' },
  { name: 'Candle Centerpiece', category: 'Centerpieces', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
  { name: 'White Tablecloth', category: 'Tablecloths', quantityAvailable: 50, imageUrl: '/images/white_tablecloth.jpg' },
  { name: 'Black Tablecloth', category: 'Tablecloths', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80' },
  { name: 'String Lights', category: 'Lighting', quantityAvailable: 25, imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80' },
  { name: 'Spotlight', category: 'Lighting', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?auto=format&fit=crop&w=400&q=80' },
  { name: 'Step & Repeat Backdrop', category: 'Backdrops', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80' },
  { name: 'Floral Wall Backdrop', category: 'Backdrops', quantityAvailable: 3, imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=400&q=80' },

  // Tech & Audio
  { name: 'Bluetooth Speaker', category: 'Speakers', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80' },
  { name: 'PA Speaker System', category: 'Speakers', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Wireless Microphone', category: 'Microphones', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Projector', category: 'Projectors', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&q=80' },
  { name: 'Projection Screen', category: 'Screens', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Laptop', category: 'Computers', quantityAvailable: 6, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80' },

  // Catering
  { name: 'Chafing Dish Set', category: 'Buffet Equipment', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80' },
  { name: 'Wine Glass Set (12)', category: 'Glassware', quantityAvailable: 30, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dinner Plate Set (12)', category: 'Serving Dishes', quantityAvailable: 25, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cutlery Set (12)', category: 'Cutlery', quantityAvailable: 25, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80' },

  // Other
  { name: 'Event Tent 10x10', category: 'Tents', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dance Floor (20x20)', category: 'Dance Floors', quantityAvailable: 2, imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Generator', category: 'Generators', quantityAvailable: 3, imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
];

async function seed() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://numi-dina:7nmyCER4P8zq.pq@project.j8malzx.mongodb.net/productseventInventory?appName=project';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  console.log('Cleared existing products');

  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
