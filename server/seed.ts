import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/productModel';

dotenv.config();

const products = [
  // Tables
  { name: 'Round Banquet Table (60")', category: 'Tables', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Rectangular Folding Table (8ft)', category: 'Tables', quantityAvailable: 40, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'Cocktail High Table', category: 'Tables', quantityAvailable: 30, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Sweetheart Table', category: 'Tables', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400' },
  { name: 'Kids Activity Table', category: 'Tables', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Serpentine Table', category: 'Tables', quantityAvailable: 15, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },

  // Chairs
  { name: 'Chiavari Gold Chair', category: 'Chairs', quantityAvailable: 200, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400' },
  { name: 'Chiavari Silver Chair', category: 'Chairs', quantityAvailable: 200, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400' },
  { name: 'White Folding Chair', category: 'Chairs', quantityAvailable: 300, imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' },
  { name: 'Ghost Chair (Clear Acrylic)', category: 'Chairs', quantityAvailable: 80, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Throne Chair (King & Queen)', category: 'Chairs', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400' },
  { name: 'Velvet Banquet Chair', category: 'Chairs', quantityAvailable: 150, imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' },
  { name: 'Cross Back Wooden Chair', category: 'Chairs', quantityAvailable: 120, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400' },

  // Sofas & Lounge Furniture
  { name: 'White Leather Sofa (3-Seater)', category: 'Sofas', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Velvet Loveseat (Blush Pink)', category: 'Sofas', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Chesterfield Sofa (Ivory)', category: 'Sofas', quantityAvailable: 6, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Ottoman Cube Set (4 pieces)', category: 'Lounge Furniture', quantityAvailable: 15, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { name: 'Lounge Armchair (Gold Legs)', category: 'Lounge Furniture', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400' },
  { name: 'Cabana Lounge Set', category: 'Lounge Furniture', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },

  // Tablecloths
  { name: 'White Satin Tablecloth (Round 120")', category: 'Tablecloths', quantityAvailable: 100, imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400' },
  { name: 'Ivory Lace Overlay', category: 'Tablecloths', quantityAvailable: 80, imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400' },
  { name: 'Navy Blue Velvet Tablecloth', category: 'Tablecloths', quantityAvailable: 60, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'Gold Sequin Tablecloth', category: 'Tablecloths', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Blush Pink Chiffon Runner', category: 'Tablecloths', quantityAvailable: 70, imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400' },
  { name: 'Black Pintuck Tablecloth', category: 'Tablecloths', quantityAvailable: 60, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },

  // Centerpieces
  { name: 'Tall Glass Cylinder Vase', category: 'Centerpieces', quantityAvailable: 60, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Gold Candelabra (5-arm)', category: 'Centerpieces', quantityAvailable: 30, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Mirror Tile Centerpiece Base', category: 'Centerpieces', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Floating Candle Bowl', category: 'Centerpieces', quantityAvailable: 40, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Acrylic Riser Set', category: 'Centerpieces', quantityAvailable: 35, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Floral Hoop Centerpiece Frame', category: 'Centerpieces', quantityAvailable: 25, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },

  // Lighting
  { name: 'String Fairy Lights (10m)', category: 'Lighting', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Uplighting LED (set of 10)', category: 'Lighting', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Chandelier (Crystal, 36")', category: 'Lighting', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Neon Sign (Custom Text)', category: 'Lighting', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Lantern Centerpiece Light', category: 'Lighting', quantityAvailable: 40, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Gobo Projector (Monogram)', category: 'Lighting', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Dance Floor Lighting Kit', category: 'Lighting', quantityAvailable: 6, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },

  // Backdrops
  { name: 'White Floral Wall Backdrop (8x8ft)', category: 'Backdrops', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400' },
  { name: 'Gold Sequin Backdrop Curtain', category: 'Backdrops', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Greenery Hedge Wall Panel', category: 'Backdrops', quantityAvailable: 12, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Balloon Arch Frame (10ft)', category: 'Backdrops', quantityAvailable: 6, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Acrylic Welcome Sign Stand', category: 'Backdrops', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Chuppah Frame (White Wood)', category: 'Backdrops', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },

  // Floral Arrangements
  { name: 'Bridal Bouquet (White Roses)', category: 'Floral Arrangements', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Table Floral Arrangement (Low)', category: 'Floral Arrangements', quantityAvailable: 40, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Tall Floral Arrangement', category: 'Floral Arrangements', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Flower Wall Garland (3m)', category: 'Floral Arrangements', quantityAvailable: 15, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },
  { name: 'Aisle Pew Flowers (set of 10)', category: 'Floral Arrangements', quantityAvailable: 8, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780c4e2e5a2c?w=400' },

  // Speakers & Audio
  { name: 'Bluetooth Speaker (Large)', category: 'Speakers', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
  { name: 'PA Speaker System (1000W)', category: 'Speakers', quantityAvailable: 6, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
  { name: 'Wireless Microphone (Handheld)', category: 'Microphones', quantityAvailable: 15, imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400' },
  { name: 'Lapel Microphone (Clip-on)', category: 'Microphones', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400' },
  { name: 'DJ Mixer & Controller', category: 'Speakers', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },

  // Projectors & Screens
  { name: 'HD Projector (4000 lumens)', category: 'Projectors', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400' },
  { name: 'Projection Screen (10ft)', category: 'Screens', quantityAvailable: 5, imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400' },
  { name: 'LED Video Wall Panel (set of 9)', category: 'Screens', quantityAvailable: 3, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },

  // Catering
  { name: 'Chafing Dish Set (Stainless)', category: 'Buffet Equipment', quantityAvailable: 30, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'Beverage Dispenser (3 gallon)', category: 'Buffet Equipment', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'Wine Glass (set of 12)', category: 'Glassware', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Champagne Flute (set of 12)', category: 'Glassware', quantityAvailable: 50, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Silver Cutlery Set (per 10)', category: 'Cutlery', quantityAvailable: 60, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'White China Dinner Plate (per 10)', category: 'Serving Dishes', quantityAvailable: 80, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' },
  { name: 'Tiered Dessert Stand', category: 'Serving Dishes', quantityAvailable: 20, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
  { name: 'Candy Bar Display Set', category: 'Serving Dishes', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },

  // Tents & Outdoor
  { name: 'Marquee Tent (20x40ft)', category: 'Tents', quantityAvailable: 3, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Canopy Tent (10x10ft)', category: 'Tents', quantityAvailable: 10, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' },
  { name: 'Dance Floor (20x20ft Wood)', category: 'Dance Floors', quantityAvailable: 3, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Dance Floor (LED Light-Up)', category: 'Dance Floors', quantityAvailable: 2, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { name: 'Generator (8000W Silent)', category: 'Generators', quantityAvailable: 4, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventInventory')
  await Product.insertMany(products)
  console.log(`✅ Seeded ${products.length} products`)
  await mongoose.disconnect()
}

seed().catch(console.error)
