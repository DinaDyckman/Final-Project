import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/productModel';

dotenv.config();

const products = [
  // Event Furniture
  { name: 'Round Banquet Table', category: 'Tables', quantityAvailable: 20, imageUrl: '' },
  { name: 'Rectangular Folding Table', category: 'Tables', quantityAvailable: 30, imageUrl: '' },
  { name: 'Cocktail Table', category: 'Tables', quantityAvailable: 15, imageUrl: '' },
  { name: 'Chiavari Chair', category: 'Chairs', quantityAvailable: 200, imageUrl: '' },
  { name: 'Folding Chair', category: 'Chairs', quantityAvailable: 300, imageUrl: '' },
  { name: 'Throne Chair', category: 'Chairs', quantityAvailable: 2, imageUrl: '' },
  { name: 'Lounge Sofa', category: 'Sofas', quantityAvailable: 8, imageUrl: '' },
  { name: 'Ottoman', category: 'Lounge Furniture', quantityAvailable: 12, imageUrl: '' },

  // Decor
  { name: 'Floral Centerpiece', category: 'Centerpieces', quantityAvailable: 40, imageUrl: '' },
  { name: 'Candle Centerpiece', category: 'Centerpieces', quantityAvailable: 50, imageUrl: '' },
  { name: 'White Tablecloth', category: 'Tablecloths', quantityAvailable: 50, imageUrl: '/images/white_tablecloth.jpg' },
  { name: 'Black Tablecloth', category: 'Tablecloths', quantityAvailable: 50, imageUrl: '' },
  { name: 'String Lights', category: 'Lighting', quantityAvailable: 25, imageUrl: '' },
  { name: 'Spotlight', category: 'Lighting', quantityAvailable: 10, imageUrl: '' },
  { name: 'Step & Repeat Backdrop', category: 'Backdrops', quantityAvailable: 5, imageUrl: '' },
  { name: 'Floral Wall Backdrop', category: 'Backdrops', quantityAvailable: 3, imageUrl: '' },

  // Tech & Audio
  { name: 'Bluetooth Speaker', category: 'Speakers', quantityAvailable: 10, imageUrl: '' },
  { name: 'PA Speaker System', category: 'Speakers', quantityAvailable: 4, imageUrl: '' },
  { name: 'Wireless Microphone', category: 'Microphones', quantityAvailable: 8, imageUrl: '' },
  { name: 'Projector', category: 'Projectors', quantityAvailable: 5, imageUrl: '' },
  { name: 'Projection Screen', category: 'Screens', quantityAvailable: 5, imageUrl: '' },
  { name: 'Laptop', category: 'Computers', quantityAvailable: 6, imageUrl: '' },

  // Catering
  { name: 'Chafing Dish Set', category: 'Buffet Equipment', quantityAvailable: 20, imageUrl: '' },
  { name: 'Wine Glass Set (12)', category: 'Glassware', quantityAvailable: 30, imageUrl: '' },
  { name: 'Dinner Plate Set (12)', category: 'Serving Dishes', quantityAvailable: 25, imageUrl: '' },
  { name: 'Cutlery Set (12)', category: 'Cutlery', quantityAvailable: 25, imageUrl: '' },

  // Other
  { name: 'Event Tent 10x10', category: 'Tents', quantityAvailable: 5, imageUrl: '' },
  { name: 'Dance Floor (20x20)', category: 'Dance Floors', quantityAvailable: 2, imageUrl: '' },
  { name: 'Generator', category: 'Generators', quantityAvailable: 3, imageUrl: '' },
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
