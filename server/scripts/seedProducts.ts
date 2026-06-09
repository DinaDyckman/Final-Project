import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const products = [
  // TABLECLOTHS (20)
  { name: 'Ivory Satin Tablecloth', category: 'Tablecloths', quantityAvailable: 40, price: 12, imageUrl: 'https://images.unsplash.com/photo-1550159930-40066082a4fc?w=400&q=80' },
  { name: 'Navy Blue Tablecloth', category: 'Tablecloths', quantityAvailable: 35, price: 12, imageUrl: 'https://images.unsplash.com/photo-1563897539633-7374c276c212?w=400&q=80' },
  { name: 'Blush Pink Tablecloth', category: 'Tablecloths', quantityAvailable: 30, price: 12, imageUrl: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&q=80' },
  { name: 'Gold Sequin Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 25, imageUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400&q=80' },
  { name: 'Silver Sequin Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 25, imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80' },
  { name: 'Burgundy Velvet Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 18, imageUrl: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&q=80' },
  { name: 'Forest Green Tablecloth', category: 'Tablecloths', quantityAvailable: 30, price: 12, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80' },
  { name: 'Rose Gold Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 15, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
  { name: 'Champagne Linen Tablecloth', category: 'Tablecloths', quantityAvailable: 40, price: 14, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80' },
  { name: 'Royal Blue Tablecloth', category: 'Tablecloths', quantityAvailable: 30, price: 12, imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
  { name: 'Dusty Rose Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 12, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Sage Green Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 12, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { name: 'Terracotta Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 12, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { name: 'Peach Tablecloth', category: 'Tablecloths', quantityAvailable: 30, price: 12, imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80' },
  { name: 'Lavender Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 12, imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80' },
  { name: 'Emerald Green Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 14, imageUrl: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=400&q=80' },
  { name: 'Coral Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 12, imageUrl: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400&q=80' },
  { name: 'Teal Tablecloth', category: 'Tablecloths', quantityAvailable: 25, price: 12, imageUrl: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&q=80' },
  { name: 'Mustard Yellow Tablecloth', category: 'Tablecloths', quantityAvailable: 20, price: 12, imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80' },
  { name: 'Charcoal Gray Tablecloth', category: 'Tablecloths', quantityAvailable: 30, price: 12, imageUrl: 'https://images.unsplash.com/photo-1517707711963-a2f6a4c0e5c7?w=400&q=80' },

  // CENTERPIECES (15)
  { name: 'Tall Glass Vase Centerpiece', category: 'Centerpieces', quantityAvailable: 20, price: 35, imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&q=80' },
  { name: 'Gold Candelabra Centerpiece', category: 'Centerpieces', quantityAvailable: 15, price: 45, imageUrl: 'https://images.unsplash.com/photo-1548963670-9caa42a5b2e5?w=400&q=80' },
  { name: 'Silver Mercury Vase Centerpiece', category: 'Centerpieces', quantityAvailable: 18, price: 40, imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0b75?w=400&q=80' },
  { name: 'Rustic Lantern Centerpiece', category: 'Centerpieces', quantityAvailable: 25, price: 30, imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Orchid Centerpiece', category: 'Centerpieces', quantityAvailable: 15, price: 55, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=400&q=80' },
  { name: 'Rose Bouquet Centerpiece', category: 'Centerpieces', quantityAvailable: 20, price: 50, imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80' },
  { name: 'Succulent Garden Centerpiece', category: 'Centerpieces', quantityAvailable: 20, price: 35, imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80' },
  { name: 'Floating Candle Bowl', category: 'Centerpieces', quantityAvailable: 30, price: 25, imageUrl: 'https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?w=400&q=80' },
  { name: 'Mirror Ball Centerpiece', category: 'Centerpieces', quantityAvailable: 10, price: 60, imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80' },
  { name: 'Wildflower Centerpiece', category: 'Centerpieces', quantityAvailable: 20, price: 40, imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80' },
  { name: 'Crystal Candle Holder Set', category: 'Centerpieces', quantityAvailable: 25, price: 30, imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80' },
  { name: 'Tropical Floral Centerpiece', category: 'Centerpieces', quantityAvailable: 15, price: 55, imageUrl: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=400&q=80' },
  { name: 'Eucalyptus Wreath Centerpiece', category: 'Centerpieces', quantityAvailable: 18, price: 38, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { name: 'Geometric Terrarium Centerpiece', category: 'Centerpieces', quantityAvailable: 12, price: 45, imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80' },
  { name: 'Pampas Grass Centerpiece', category: 'Centerpieces', quantityAvailable: 15, price: 42, imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80' },

  // CHAIRS (10)
  { name: 'Ghost Chair', category: 'Chairs', quantityAvailable: 50, price: 8, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80' },
  { name: 'Cross Back Chair', category: 'Chairs', quantityAvailable: 80, price: 7, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { name: 'Bamboo Chair', category: 'Chairs', quantityAvailable: 60, price: 6, imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80' },
  { name: 'Velvet Accent Chair', category: 'Chairs', quantityAvailable: 30, price: 15, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { name: 'Gold Chiavari Chair', category: 'Chairs', quantityAvailable: 100, price: 9, imageUrl: 'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?w=400&q=80' },
  { name: 'Silver Chiavari Chair', category: 'Chairs', quantityAvailable: 100, price: 9, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'White Resin Chair', category: 'Chairs', quantityAvailable: 120, price: 5, imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80' },
  { name: 'Black Folding Chair', category: 'Chairs', quantityAvailable: 150, price: 4, imageUrl: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=400&q=80' },
  { name: 'Padded Banquet Chair', category: 'Chairs', quantityAvailable: 80, price: 8, imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80' },
  { name: 'Peacock Chair', category: 'Chairs', quantityAvailable: 10, price: 30, imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400&q=80' },

  // TABLES (8)
  { name: 'Sweetheart Table', category: 'Tables', quantityAvailable: 5, price: 60, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80' },
  { name: 'Serpentine Table', category: 'Tables', quantityAvailable: 8, price: 45, imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80' },
  { name: 'Farmhouse Table', category: 'Tables', quantityAvailable: 10, price: 55, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { name: 'Acrylic Ghost Table', category: 'Tables', quantityAvailable: 6, price: 70, imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80' },
  { name: 'Half Moon Table', category: 'Tables', quantityAvailable: 8, price: 40, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80' },
  { name: 'Bar Height Table', category: 'Tables', quantityAvailable: 15, price: 35, imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80' },
  { name: 'Kids Activity Table', category: 'Tables', quantityAvailable: 10, price: 20, imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80' },
  { name: 'Square Banquet Table', category: 'Tables', quantityAvailable: 12, price: 35, imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80' },

  // LIGHTING (10)
  { name: 'Crystal Chandelier', category: 'Lighting', quantityAvailable: 5, price: 150, imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
  { name: 'LED Uplighting Set (12)', category: 'Lighting', quantityAvailable: 8, price: 120, imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80' },
  { name: 'Edison Bulb String Lights', category: 'Lighting', quantityAvailable: 20, price: 35, imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80' },
  { name: 'Fairy Light Curtain', category: 'Lighting', quantityAvailable: 15, price: 40, imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80' },
  { name: 'Neon Sign (Custom)', category: 'Lighting', quantityAvailable: 3, price: 200, imageUrl: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&q=80' },
  { name: 'Paper Lanterns Set (10)', category: 'Lighting', quantityAvailable: 20, price: 25, imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80' },
  { name: 'Gobo Projector Light', category: 'Lighting', quantityAvailable: 4, price: 80, imageUrl: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&q=80' },
  { name: 'Candelabra Floor Lamp', category: 'Lighting', quantityAvailable: 8, price: 55, imageUrl: 'https://images.unsplash.com/photo-1548963670-9caa42a5b2e5?w=400&q=80' },
  { name: 'Globe String Lights', category: 'Lighting', quantityAvailable: 18, price: 30, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80' },
  { name: 'Color Wash LED Par Can', category: 'Lighting', quantityAvailable: 12, price: 45, imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80' },

  // BACKDROPS (8)
  { name: 'Gold Sequin Backdrop', category: 'Backdrops', quantityAvailable: 5, price: 80, imageUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400&q=80' },
  { name: 'White Balloon Arch Backdrop', category: 'Backdrops', quantityAvailable: 4, price: 120, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80' },
  { name: 'Greenery Hedge Wall', category: 'Backdrops', quantityAvailable: 3, price: 150, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { name: 'Macrame Backdrop', category: 'Backdrops', quantityAvailable: 4, price: 90, imageUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400&q=80' },
  { name: 'Rose Gold Sequin Backdrop', category: 'Backdrops', quantityAvailable: 5, price: 80, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
  { name: 'Rustic Wood Plank Backdrop', category: 'Backdrops', quantityAvailable: 3, price: 100, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Silver Tinsel Backdrop', category: 'Backdrops', quantityAvailable: 6, price: 60, imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80' },
  { name: 'Flower Wall Panel (4x4)', category: 'Backdrops', quantityAvailable: 4, price: 130, imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80' },

  // LOUNGE FURNITURE (8)
  { name: 'Velvet Loveseat', category: 'Lounge Furniture', quantityAvailable: 8, price: 80, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { name: 'Rattan Lounge Chair', category: 'Lounge Furniture', quantityAvailable: 12, price: 40, imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80' },
  { name: 'Chesterfield Sofa', category: 'Lounge Furniture', quantityAvailable: 4, price: 120, imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80' },
  { name: 'Barrel Chair', category: 'Lounge Furniture', quantityAvailable: 10, price: 45, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80' },
  { name: 'Cube Ottoman Set (4)', category: 'Lounge Furniture', quantityAvailable: 8, price: 60, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { name: 'Hanging Egg Chair', category: 'Lounge Furniture', quantityAvailable: 4, price: 90, imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400&q=80' },
  { name: 'White L-Shape Sofa', category: 'Lounge Furniture', quantityAvailable: 3, price: 180, imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80' },
  { name: 'Tufted Bench', category: 'Lounge Furniture', quantityAvailable: 10, price: 35, imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },

  // CATERING (15)
  { name: 'Silver Serving Platter', category: 'Serving Dishes', quantityAvailable: 30, price: 10, imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80' },
  { name: 'Round Serving Tray', category: 'Serving Dishes', quantityAvailable: 25, price: 8, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80' },
  { name: 'Soup Tureen Set', category: 'Serving Dishes', quantityAvailable: 10, price: 20, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },
  { name: 'Champagne Flute Set (12)', category: 'Glassware', quantityAvailable: 20, price: 18, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
  { name: 'Whiskey Glass Set (12)', category: 'Glassware', quantityAvailable: 15, price: 18, imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80' },
  { name: 'Water Pitcher Set (6)', category: 'Glassware', quantityAvailable: 20, price: 22, imageUrl: 'https://images.unsplash.com/photo-1548940740-204726a19be3?w=400&q=80' },
  { name: 'Gold Cutlery Set (24)', category: 'Cutlery', quantityAvailable: 15, price: 30, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80' },
  { name: 'Silver Cutlery Set (24)', category: 'Cutlery', quantityAvailable: 20, price: 28, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80' },
  { name: 'Dessert Fork Set (24)', category: 'Cutlery', quantityAvailable: 20, price: 15, imageUrl: 'https://images.unsplash.com/photo-1575467678930-c7acd65d6470?w=400&q=80' },
  { name: 'Stainless Steel Buffet Tong Set', category: 'Buffet Equipment', quantityAvailable: 20, price: 12, imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80' },
  { name: 'Tiered Cake Stand', category: 'Serving Dishes', quantityAvailable: 10, price: 20, imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80' },
  { name: 'Beverage Dispenser', category: 'Buffet Equipment', quantityAvailable: 12, price: 25, imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
  { name: 'Ice Bucket Set (4)', category: 'Buffet Equipment', quantityAvailable: 15, price: 20, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'Dessert Plate Set (12)', category: 'Serving Dishes', quantityAvailable: 20, price: 15, imageUrl: 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&q=80' },
  { name: 'Bread Basket Set (6)', category: 'Serving Dishes', quantityAvailable: 15, price: 12, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },

  // TECH & AUDIO (10)
  { name: 'DJ Controller', category: 'Speakers', quantityAvailable: 3, price: 150, imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80' },
  { name: 'Subwoofer Speaker', category: 'Speakers', quantityAvailable: 4, price: 80, imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80' },
  { name: 'Podium Microphone', category: 'Microphones', quantityAvailable: 5, price: 30, imageUrl: 'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=400&q=80' },
  { name: 'Lavalier Microphone', category: 'Microphones', quantityAvailable: 6, price: 25, imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80' },
  { name: '4K Projector', category: 'Projectors', quantityAvailable: 3, price: 120, imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80' },
  { name: 'LED Video Wall Panel (4x4)', category: 'Screens', quantityAvailable: 2, price: 300, imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80' },
  { name: 'Tablet (iPad)', category: 'Computers', quantityAvailable: 8, price: 40, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
  { name: 'Photo Booth Machine', category: 'Computers', quantityAvailable: 2, price: 200, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
  { name: 'Portable PA System', category: 'Speakers', quantityAvailable: 5, price: 70, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' },
  { name: 'Mixer Board (8 Channel)', category: 'Speakers', quantityAvailable: 3, price: 90, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },

  // OTHER (10)
  { name: 'Marquee Letter Set A-Z', category: 'Backdrops', quantityAvailable: 26, price: 20, imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80' },
  { name: 'Red Carpet Runner (10ft)', category: 'Dance Floors', quantityAvailable: 5, price: 40, imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
  { name: 'White Dance Floor (10x10)', category: 'Dance Floors', quantityAvailable: 3, price: 120, imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80' },
  { name: 'Portable Bar Unit', category: 'Buffet Equipment', quantityAvailable: 3, price: 100, imageUrl: 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=400&q=80' },
  { name: 'Coat Rack', category: 'Other', quantityAvailable: 10, price: 15, imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80' },
  { name: 'Decorative Room Divider', category: 'Backdrops', quantityAvailable: 6, price: 55, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { name: 'Acrylic Welcome Sign Stand', category: 'Backdrops', quantityAvailable: 8, price: 40, imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
  { name: 'Portable Restroom Unit', category: 'Portable Restrooms', quantityAvailable: 3, price: 200, imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' },
  { name: 'Easel Stand', category: 'Other', quantityAvailable: 15, price: 10, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80' },
  { name: 'Gift Table with Skirt', category: 'Tables', quantityAvailable: 8, price: 30, imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80' },
];

async function seedProducts() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to DB');

  const db = mongoose.connection.db!;
  const result = await db.collection('products').insertMany(
    products.map(p => ({ ...p, createdAt: new Date(), updatedAt: new Date() }))
  );

  console.log(`✅ Inserted ${result.insertedCount} products!`);
  await mongoose.disconnect();
}

seedProducts().catch(console.error);
