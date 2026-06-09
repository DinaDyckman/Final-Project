import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PRODUCT_IMAGES: Record<string, string> = {
<<<<<<< HEAD
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
=======
  'White Tablecloth':               '/images/white_tablecloth.jpg',
  'Black Tablecloth':               'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&q=80',
  'Round Banquet Table':            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  'Rectangular Folding Table':      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80',
  'Cocktail Table':                 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80',
  'Chiavari Chair':                 'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?w=400&q=80',
  'Folding Chair':                  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
  'Throne Chair':                   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Lounge Sofa':                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'Ottoman':                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Floral Centerpiece':             'https://images.unsplash.com/photo-1487530811015-780780169993?w=400&q=80',
  'Candle Centerpiece':             'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80',
  'String Lights':                  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
  'Spotlight':                      'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&q=80',
  'Step & Repeat Backdrop':         'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
  'Floral Wall Backdrop':           'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80',
  'Bluetooth Speaker':              'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'PA Speaker System':              'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
  'Wireless Microphone':            'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
  'Projector':                      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
  'Projection Screen':              'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80',
  'Laptop':                         'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'Chafing Dish Set':               'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
  'Wine Glass Set (12)':            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  'Cutlery Set (12)':               'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80',
  'Dinner Plate Set (12)':          'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&q=80',
  'Event Tent 10x10':               'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
  'Generator':                      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
  'Dance Floor (20x20)':            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80',
  'cloth napkins':                  'https://images.unsplash.com/photo-1620735692151-26a7e0748429?w=400&q=80',
  'vase':                           'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&q=80',
  'Pink Ribbed Wine Glass':         'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  'Bar Height Table':               'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
  'Edison Bulb String Lights':      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80',
  'Flower Wall Panel (4x4)':        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=80',
  'Marquee Letter A-Z':             'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80',
  'Velvet Loveseat':                'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
  'Silver Serving Platter':         'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80',
  'Champagne Flute Set (12)':       'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  'Gold Cutlery Set (24)':          'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80',
  'Stainless Steel Buffet Tong Set':'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
  'Subwoofer Speaker':              'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
  'Lavalier Microphone':            'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
  '4K Projector':                   'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
  'LED Video Wall Panel (4x4)':     'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80',
  'White Dance Floor (10x10)':      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80',
  'Portable Restroom Unit':         'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
  'Ivory Satin Tablecloth':         'https://images.unsplash.com/photo-1550159930-40066082a4fc?w=400&q=80',
  'Navy Blue Tablecloth':           'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80',
  'Blush Pink Tablecloth':          'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&q=80',
  'Gold Sequin Tablecloth':         'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400&q=80',
  'Silver Sequin Tablecloth':       'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80',
  'Burgundy Velvet Tablecloth':     'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'Forest Green Tablecloth':        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  'Rose Gold Tablecloth':           'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  'Champagne Linen Tablecloth':     'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
  'Royal Blue Tablecloth':          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
  'Dusty Rose Tablecloth':          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'Sage Green Tablecloth':          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Terracotta Tablecloth':          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  'Peach Tablecloth':               'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
  'Lavender Tablecloth':            'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=400&q=80',
  'Emerald Green Tablecloth':       'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400&q=80',
  'Coral Tablecloth':               'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&q=80',
  'Teal Tablecloth':                'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80',
  'Mustard Yellow Tablecloth':      'https://images.unsplash.com/photo-1517707711963-a2f6a4c0e5c7?w=400&q=80',
  'Charcoal Gray Tablecloth':       'https://images.unsplash.com/photo-1533090368093-c5c4f7bc1098?w=400&q=80',
  'Tall Glass Vase Centerpiece':    'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&q=80',
  'Gold Candelabra Centerpiece':    'https://images.unsplash.com/photo-1548963670-9caa42a5b2e5?w=400&q=80',
  'Silver Mercury Vase Centerpiece':'https://images.unsplash.com/photo-1563241527-3004b7be0b75?w=400&q=80',
  'Rustic Lantern Centerpiece':     'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
  'Orchid Centerpiece':             'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=400&q=80',
  'Rose Bouquet Centerpiece':       'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80',
  'Succulent Garden Centerpiece':   'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80',
  'Floating Candle Bowl':           'https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?w=400&q=80',
  'Mirror Ball Centerpiece':        'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80',
  'Wildflower Centerpiece':         'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80',
  'Crystal Candle Holder Set':      'https://images.unsplash.com/photo-1476742358291-9f7a06f8f35e?w=400&q=80',
  'Tropical Floral Centerpiece':    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=400&q=80',
  'Eucalyptus Wreath Centerpiece':  'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=400&q=80',
  'Geometric Terrarium Centerpiece':'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&q=80',
  'Pampas Grass Centerpiece':       'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=400&q=80',
  'Ghost Chair':                    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  'Cross Back Chair':               'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80',
  'Bamboo Chair':                   'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80',
  'Velvet Accent Chair':            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Gold Chiavari Chair':            'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
  'Silver Chiavari Chair':          'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=400&q=80',
  'White Resin Chair':              'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400&q=80',
  'Black Folding Chair':            'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=400&q=80',
  'Padded Banquet Chair':           'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
  'Peacock Chair':                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'Sweetheart Table':               'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  'Serpentine Table':               'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80',
  'Farmhouse Table':                'https://images.unsplash.com/photo-1533090368093-c5c4f7bc1098?w=400&q=80',
  'Acrylic Ghost Table':            'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80',
  'Half Moon Table':                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
  'Kids Activity Table':            'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
  'Square Banquet Table':           'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
  'Gift Table with Skirt':          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
  'Crystal Chandelier':             'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
  'LED Uplighting Set (12)':        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80',
  'Fairy Light Curtain':            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
  'Neon Sign (Custom)':             'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&q=80',
  'Paper Lanterns Set (10)':        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80',
  'Gobo Projector Light':           'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&q=80',
  'Candelabra Floor Lamp':          'https://images.unsplash.com/photo-1548963670-9caa42a5b2e5?w=400&q=80',
  'Globe String Lights':            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
  'Color Wash LED Par Can':         'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80',
  'Gold Sequin Backdrop':           'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400&q=80',
  'White Balloon Arch Backdrop':    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  'Greenery Hedge Wall':            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Macrame Backdrop':               'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400&q=80',
  'Rose Gold Sequin Backdrop':      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'Rustic Wood Plank Backdrop':     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'Silver Tinsel Backdrop':         'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80',
  'Acrylic Welcome Sign Stand':     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',
  'Decorative Room Divider':        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
  'Rattan Lounge Chair':            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80',
  'Chesterfield Sofa':              'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
  'Barrel Chair':                   'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  'Cube Ottoman Set (4)':           'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'Hanging Egg Chair':              'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400&q=80',
  'White L-Shape Sofa':             'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80',
  'Tufted Bench':                   'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
  'Round Serving Tray':             'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  'Soup Tureen Set':                'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
  'Whiskey Glass Set (12)':         'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  'Water Pitcher Set (6)':          'https://images.unsplash.com/photo-1548940740-204726a19be3?w=400&q=80',
  'Silver Cutlery Set (24)':        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
  'Dessert Fork Set (24)':          'https://images.unsplash.com/photo-1575467678930-c7acd65d6470?w=400&q=80',
  'Tiered Cake Stand':              'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80',
  'Beverage Dispenser':             'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Ice Bucket Set (4)':             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Dessert Plate Set (12)':         'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&q=80',
  'Bread Basket Set (6)':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  'DJ Controller':                  'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80',
  'Podium Microphone':              'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=400&q=80',
  'Tablet (iPad)':                  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  'Photo Booth Machine':            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  'Portable PA System':             'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  'Mixer Board (8 Channel)':        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  'Red Carpet Runner (10ft)':       'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
  'Portable Bar Unit':              'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=400&q=80',
  'Coat Rack':                      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
  'Easel Stand':                    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
};

async function updateAllImages() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to DB');
  const db = mongoose.connection.db!;
  let updated = 0, notFound = 0;
  for (const [name, imageUrl] of Object.entries(PRODUCT_IMAGES)) {
    const result = await db.collection('products').updateMany({ name }, { $set: { imageUrl } });
    if (result.modifiedCount > 0) { console.log(`✅ ${name}`); updated++; }
    else { console.log(`⚠️  Not found: ${name}`); notFound++; }
  }
  console.log(`\nDone! Updated: ${updated}, Not found: ${notFound}`);
  await mongoose.disconnect();
}

updateAllImages().catch(console.error);
>>>>>>> 79e8803ca6d9db745081c0856039f2ca0faa7b8b
