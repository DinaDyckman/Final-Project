import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PRODUCT_IMAGES: Record<string, string> = {
  'Round Banquet Table':       'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
  'Rectangular Folding Table': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
  'Cocktail Table':            'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80',
  'Chiavari Chair':            'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?w=400&q=80',
  'Folding Chair':             'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
  'Throne Chair':              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Lounge Sofa':               'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'Ottoman':                   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Floral Centerpiece':        'https://images.unsplash.com/photo-1487530811015-780780169993?w=400&q=80',
  'Candle Centerpiece':        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'White Tablecloth':          '/images/white_tablecloth.jpg',
  'Black Tablecloth':          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  'String Lights':             'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
  'Spotlight':                 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&q=80',
  'Step & Repeat Backdrop':    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
  'Floral Wall Backdrop':      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80',
  'Bluetooth Speaker':         'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'PA Speaker System':         'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
  'Wireless Microphone':       'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
  'Projector':                 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
  'Projection Screen':         'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80',
  'Laptop':                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'Chafing Dish Set':          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80',
  'Wine Glass Set (12)':       'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  'Cutlery Set (12)':          'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80',
  'Dinner Plate Set (12)':     'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&q=80',
  'Event Tent 10x10':          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
  'Generator':                 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
  'Dance Floor (20x20)':       'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80',
  'cloth napkins':             'https://images.unsplash.com/photo-1620735692151-26a7e0748429?w=400&q=80',
};

async function updateImages() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to DB');

  const db = mongoose.connection.db!;
  let updated = 0;

  for (const [name, imageUrl] of Object.entries(PRODUCT_IMAGES)) {
    const result = await db.collection('products').updateOne({ name }, { $set: { imageUrl } });
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated: ${name}`);
      updated++;
    } else {
      console.log(`⚠️  Not found: ${name}`);
    }
  }

  console.log(`\nDone! Updated ${updated} products.`);
  await mongoose.disconnect();
}

updateImages().catch(console.error);
