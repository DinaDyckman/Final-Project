import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PRODUCT_DATA: Record<string, { price: number; qty: number }> = {
  // TABLECLOTHS - cheap to rent, high stock
  'White Tablecloth':               { price: 8,   qty: 80 },
  'Black Tablecloth':               { price: 8,   qty: 80 },
  'Ivory Satin Tablecloth':         { price: 10,  qty: 60 },
  'Navy Blue Tablecloth':           { price: 8,   qty: 60 },
  'Blush Pink Tablecloth':          { price: 8,   qty: 60 },
  'Gold Sequin Tablecloth':         { price: 22,  qty: 30 },
  'Silver Sequin Tablecloth':       { price: 22,  qty: 30 },
  'Burgundy Velvet Tablecloth':     { price: 15,  qty: 40 },
  'Forest Green Tablecloth':        { price: 8,   qty: 60 },
  'Rose Gold Tablecloth':           { price: 12,  qty: 40 },
  'Champagne Linen Tablecloth':     { price: 10,  qty: 60 },
  'Royal Blue Tablecloth':          { price: 8,   qty: 60 },
  'Dusty Rose Tablecloth':          { price: 8,   qty: 50 },
  'Sage Green Tablecloth':          { price: 8,   qty: 50 },
  'Terracotta Tablecloth':          { price: 8,   qty: 50 },
  'Peach Tablecloth':               { price: 8,   qty: 50 },
  'Lavender Tablecloth':            { price: 8,   qty: 50 },
  'Emerald Green Tablecloth':       { price: 10,  qty: 40 },
  'Coral Tablecloth':               { price: 8,   qty: 50 },
  'Teal Tablecloth':                { price: 8,   qty: 50 },
  'Mustard Yellow Tablecloth':      { price: 8,   qty: 50 },
  'Charcoal Gray Tablecloth':       { price: 8,   qty: 60 },
  'cloth napkins':                  { price: 3,   qty: 200 },

  // CHAIRS - moderate price, high stock
  'Chiavari Chair':                 { price: 6,   qty: 200 },
  'Folding Chair':                  { price: 3,   qty: 300 },
  'Throne Chair':                   { price: 45,  qty: 4 },
  'Ghost Chair':                    { price: 8,   qty: 80 },
  'Cross Back Chair':               { price: 7,   qty: 100 },
  'Bamboo Chair':                   { price: 6,   qty: 80 },
  'Velvet Accent Chair':            { price: 18,  qty: 30 },
  'Gold Chiavari Chair':            { price: 8,   qty: 150 },
  'Silver Chiavari Chair':          { price: 8,   qty: 150 },
  'White Resin Chair':              { price: 4,   qty: 200 },
  'Black Folding Chair':            { price: 3,   qty: 250 },
  'Padded Banquet Chair':           { price: 7,   qty: 120 },
  'Peacock Chair':                  { price: 55,  qty: 4 },

  // TABLES - moderate price, moderate stock
  'Round Banquet Table':            { price: 18,  qty: 40 },
  'Rectangular Folding Table':      { price: 15,  qty: 30 },
  'Cocktail Table':                 { price: 20,  qty: 25 },
  'Sweetheart Table':               { price: 65,  qty: 6 },
  'Serpentine Table':               { price: 40,  qty: 10 },
  'Farmhouse Table':                { price: 55,  qty: 8 },
  'Acrylic Ghost Table':            { price: 75,  qty: 6 },
  'Half Moon Table':                { price: 35,  qty: 12 },
  'Bar Height Table':               { price: 28,  qty: 20 },
  'Kids Activity Table':            { price: 15,  qty: 15 },
  'Square Banquet Table':           { price: 18,  qty: 20 },
  'Gift Table with Skirt':          { price: 25,  qty: 12 },

  // CENTERPIECES - moderate to expensive, moderate stock
  'Floral Centerpiece':             { price: 45,  qty: 40 },
  'Candle Centerpiece':             { price: 25,  qty: 50 },
  'Tall Glass Vase Centerpiece':    { price: 30,  qty: 25 },
  'Gold Candelabra Centerpiece':    { price: 50,  qty: 15 },
  'Silver Mercury Vase Centerpiece':{ price: 35,  qty: 20 },
  'Rustic Lantern Centerpiece':     { price: 22,  qty: 30 },
  'Orchid Centerpiece':             { price: 60,  qty: 15 },
  'Rose Bouquet Centerpiece':       { price: 55,  qty: 20 },
  'Succulent Garden Centerpiece':   { price: 28,  qty: 25 },
  'Floating Candle Bowl':           { price: 18,  qty: 40 },
  'Mirror Ball Centerpiece':        { price: 65,  qty: 10 },
  'Wildflower Centerpiece':         { price: 35,  qty: 20 },
  'Crystal Candle Holder Set':      { price: 22,  qty: 30 },
  'Tropical Floral Centerpiece':    { price: 55,  qty: 12 },
  'Eucalyptus Wreath Centerpiece':  { price: 32,  qty: 18 },
  'Geometric Terrarium Centerpiece':{ price: 40,  qty: 12 },
  'Pampas Grass Centerpiece':       { price: 38,  qty: 15 },
  'vase':                           { price: 15,  qty: 30 },

  // LIGHTING - expensive, low-moderate stock
  'String Lights':                  { price: 25,  qty: 30 },
  'Spotlight':                      { price: 35,  qty: 15 },
  'Crystal Chandelier':             { price: 180, qty: 5 },
  'LED Uplighting Set (12)':        { price: 120, qty: 8 },
  'Edison Bulb String Lights':      { price: 30,  qty: 25 },
  'Fairy Light Curtain':            { price: 35,  qty: 20 },
  'Neon Sign (Custom)':             { price: 150, qty: 4 },
  'Paper Lanterns Set (10)':        { price: 20,  qty: 25 },
  'Gobo Projector Light':           { price: 75,  qty: 6 },
  'Candelabra Floor Lamp':          { price: 45,  qty: 10 },
  'Globe String Lights':            { price: 28,  qty: 20 },
  'Color Wash LED Par Can':         { price: 40,  qty: 12 },

  // BACKDROPS - moderate to expensive, low stock
  'Step & Repeat Backdrop':         { price: 75,  qty: 6 },
  'Floral Wall Backdrop':           { price: 90,  qty: 4 },
  'Gold Sequin Backdrop':           { price: 80,  qty: 6 },
  'White Balloon Arch Backdrop':    { price: 110, qty: 4 },
  'Greenery Hedge Wall':            { price: 130, qty: 3 },
  'Macrame Backdrop':               { price: 85,  qty: 5 },
  'Rose Gold Sequin Backdrop':      { price: 80,  qty: 6 },
  'Rustic Wood Plank Backdrop':     { price: 95,  qty: 4 },
  'Silver Tinsel Backdrop':         { price: 55,  qty: 8 },
  'Flower Wall Panel (4x4)':        { price: 120, qty: 4 },
  'Marquee Letter A-Z':             { price: 18,  qty: 26 },
  'Decorative Room Divider':        { price: 50,  qty: 8 },
  'Acrylic Welcome Sign Stand':     { price: 35,  qty: 10 },

  // LOUNGE FURNITURE - moderate to expensive
  'Lounge Sofa':                    { price: 85,  qty: 8 },
  'Ottoman':                        { price: 30,  qty: 20 },
  'Velvet Loveseat':                { price: 80,  qty: 8 },
  'Rattan Lounge Chair':            { price: 35,  qty: 15 },
  'Chesterfield Sofa':              { price: 120, qty: 4 },
  'Barrel Chair':                   { price: 40,  qty: 12 },
  'Cube Ottoman Set (4)':           { price: 55,  qty: 10 },
  'Hanging Egg Chair':              { price: 85,  qty: 4 },
  'White L-Shape Sofa':             { price: 175, qty: 3 },
  'Tufted Bench':                   { price: 30,  qty: 12 },

  // CATERING - cheap, high stock
  'Chafing Dish Set':               { price: 18,  qty: 25 },
  'Wine Glass Set (12)':            { price: 15,  qty: 30 },
  'Cutlery Set (12)':               { price: 12,  qty: 30 },
  'Dinner Plate Set (12)':          { price: 14,  qty: 25 },
  'Silver Serving Platter':         { price: 10,  qty: 30 },
  'Round Serving Tray':             { price: 8,   qty: 30 },
  'Soup Tureen Set':                { price: 18,  qty: 15 },
  'Champagne Flute Set (12)':       { price: 15,  qty: 25 },
  'Whiskey Glass Set (12)':         { price: 15,  qty: 20 },
  'Pink Ribbed Wine Glass':         { price: 4,   qty: 60 },
  'Water Pitcher Set (6)':          { price: 12,  qty: 20 },
  'Gold Cutlery Set (24)':          { price: 25,  qty: 15 },
  'Silver Cutlery Set (24)':        { price: 22,  qty: 20 },
  'Dessert Fork Set (24)':          { price: 12,  qty: 20 },
  'Stainless Steel Buffet Tong Set':{ price: 8,   qty: 25 },
  'Tiered Cake Stand':              { price: 18,  qty: 12 },
  'Beverage Dispenser':             { price: 22,  qty: 15 },
  'Ice Bucket Set (4)':             { price: 16,  qty: 18 },
  'Dessert Plate Set (12)':         { price: 12,  qty: 25 },
  'Bread Basket Set (6)':           { price: 8,   qty: 25 },

  // TECH - expensive, low stock
  'Bluetooth Speaker':              { price: 45,  qty: 10 },
  'PA Speaker System':              { price: 85,  qty: 6 },
  'Wireless Microphone':            { price: 30,  qty: 10 },
  'Projector':                      { price: 80,  qty: 6 },
  'Projection Screen':              { price: 40,  qty: 8 },
  'Laptop':                         { price: 55,  qty: 6 },
  'DJ Controller':                  { price: 140, qty: 3 },
  'Subwoofer Speaker':              { price: 75,  qty: 5 },
  'Podium Microphone':              { price: 28,  qty: 8 },
  'Lavalier Microphone':            { price: 25,  qty: 8 },
  '4K Projector':                   { price: 120, qty: 4 },
  'LED Video Wall Panel (4x4)':     { price: 280, qty: 2 },
  'Tablet (iPad)':                  { price: 45,  qty: 8 },
  'Photo Booth Machine':            { price: 185, qty: 2 },
  'Portable PA System':             { price: 70,  qty: 6 },
  'Mixer Board (8 Channel)':        { price: 85,  qty: 3 },

  // OTHER
  'Event Tent 10x10':               { price: 95,  qty: 6 },
  'Generator':                      { price: 85,  qty: 4 },
  'Dance Floor (20x20)':            { price: 150, qty: 3 },
  'Red Carpet Runner (10ft)':       { price: 35,  qty: 8 },
  'White Dance Floor (10x10)':      { price: 120, qty: 3 },
  'Portable Bar Unit':              { price: 95,  qty: 4 },
  'Coat Rack':                      { price: 12,  qty: 15 },
  'Portable Restroom Unit':         { price: 180, qty: 3 },
  'Easel Stand':                    { price: 10,  qty: 18 },
};

async function updatePricesAndQty() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to DB');
  const db = mongoose.connection.db!;
  let updated = 0;

  for (const [name, { price, qty }] of Object.entries(PRODUCT_DATA)) {
    const result = await db.collection('products').updateMany(
      { name },
      { $set: { price, quantityAvailable: qty } }
    );
    if (result.modifiedCount > 0) { console.log(`✅ ${name} → $${price}/day, qty: ${qty}`); updated++; }
    else console.log(`⚠️  Not found: ${name}`);
  }

  console.log(`\nDone! Updated ${updated} products.`);
  await mongoose.disconnect();
}

updatePricesAndQty().catch(console.error);
