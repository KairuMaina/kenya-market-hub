
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  vendor: string;
  category: string;
  inStock: boolean;
  description?: string;
  brand?: string;
  year?: number; // For vehicles
  make?: string; // For auto parts
  model?: string; // For auto parts
}

const categories = ['electronics', 'fashion', 'auto-parts', 'home-kitchen', 'health-beauty', 'baby-kids', 'sports', 'books', 'toys', 'garden', 'cosmetics'];
const vendors = ['TechHub Kenya', 'StyleHub', 'AutoSpare Kenya', 'HomeEssentials', 'BeautyWorld', 'BabyCorner', 'SportZone', 'BookMart', 'ToyLand', 'GreenThumb', 'AfricanGlow Cosmetics'];

// African-focused brands
const brands = {
  electronics: ['Samsung', 'Tecno', 'Infinix', 'Itel', 'Oppo', 'Xiaomi', 'Huawei', 'Nokia', 'LG', 'Sony'],
  fashion: ['Addidas', 'Nike', 'Puma', 'Converse', 'Zara', 'H&M', 'Kikoromeo', 'Afrikan Couture', 'Shujaa', 'Ubuntu'],
  cosmetics: ['Black Opal', 'Shea Moisture', 'African Pride', 'Dark & Lovely', 'Ambi', 'Aveeno', 'Nivea', 'Vaseline', 'Cocoa Butter', 'Shea Radiance'],
  'auto-parts': ['Toyota', 'Nissan', 'Mazda', 'Mitsubishi', 'Subaru', 'Honda', 'Volkswagen', 'Mercedes', 'BMW', 'Peugeot', 'Hyundai', 'Kia', 'Isuzu', 'Ford', 'Land Rover'],
  general: ['Samsung', 'Apple', 'Nike', 'Adidas', 'Toyota', 'Sony', 'LG', 'Canon', 'Dell', 'HP']
};

// Kenyan popular vehicle makes and models (1975-2024)
const kenyanVehicles = [
  // Toyota models
  { make: 'Toyota', models: ['Corolla', 'Camry', 'Hilux', 'Land Cruiser', 'Prado', 'Vitz', 'Probox', 'Succeed', 'Premio', 'Allion', 'Mark X', 'Harrier', 'Rav4', 'Fielder', 'Belta', 'Platz', 'Vanguard', 'Alphard', 'Hiace'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Nissan models
  { make: 'Nissan', models: ['Sunny', 'March', 'Note', 'Tiida', 'X-Trail', 'Patrol', 'Navara', 'Pathfinder', 'Sentra', 'Almera', 'Primera', 'Maxima', 'Murano', 'Juke', 'Qashqai'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Mazda models
  { make: 'Mazda', models: ['Familia', 'Demio', 'Axela', 'Atenza', 'CX-5', 'CX-7', 'MPV', 'Premacy', 'Tribute', 'BT-50', '323', '626', 'RX-8'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Mitsubishi models
  { make: 'Mitsubishi', models: ['Lancer', 'Pajero', 'Canter', 'Galant', 'Outlander', 'ASX', 'L200', 'Shogun', 'Eclipse', 'Carisma'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Subaru models
  { make: 'Subaru', models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'Tribeca', 'Justy'], years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Honda models
  { make: 'Honda', models: ['Civic', 'Accord', 'CRV', 'HRV', 'Fit', 'Stream', 'Stepwagon', 'Vezel', 'Freed', 'Shuttle'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Volkswagen models
  { make: 'Volkswagen', models: ['Golf', 'Polo', 'Passat', 'Beetle', 'Jetta', 'Tiguan', 'Touareg', 'Transporter'], years: [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Isuzu models
  { make: 'Isuzu', models: ['D-Max', 'MU-X', 'NPR', 'ELF', 'Rodeo', 'Trooper', 'Wizard'], years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // Mercedes models
  { make: 'Mercedes', models: ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'B-Class', 'ML-Class', 'GL-Class', 'GLA', 'GLC', 'GLE'], years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] },
  // BMW models
  { make: 'BMW', models: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', '1 Series', '2 Series'], years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] }
];

const productNames = {
  electronics: [
    'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'MacBook Air M3', 'iPad Pro', 'AirPods Pro', 'Sony WH-1000XM5', 'Dell XPS 13', 'HP Pavilion', 'Canon EOS R6', 'Sony A7 IV',
    'Tecno Spark 10', 'Infinix Note 12', 'Itel A48 Pro', 'Oppo Reno 8', 'Xiaomi Redmi Note 12', 'Huawei P50', 'Nokia G21', 'Smart TV 55"', 'Bluetooth Speaker', 'Power Bank'
  ],
  fashion: [
    'African Print Dress', 'Kente Cloth Shirt', 'Dashiki Top', 'Ankara Skirt', 'Kitenge Blouse', 'Leather Sandals', 'Beaded Jewelry', 'Traditional Hat', 'Wax Print Fabric', 'Agbada Outfit',
    'Nike Air Force', 'Adidas Gazelle', 'Puma Suede', 'Converse All Star', 'Running Shoes', 'Casual Sneakers', 'Formal Shoes', 'High Heels', 'Boots', 'Flip Flops'
  ],
  cosmetics: [
    'Shea Butter Cream', 'Black Soap Face Wash', 'Cocoa Butter Lotion', 'African Black Soap', 'Argan Oil Hair Treatment', 'Shea Moisture Shampoo', 'Dark & Lovely Relaxer', 'Ambi Fade Cream', 'Aveeno Daily Moisturizer', 'Nivea Body Lotion',
    'Foundation for Dark Skin', 'Lip Gloss Set', 'Eye Shadow Palette', 'Mascara Waterproof', 'Nail Polish Collection', 'Face Powder Compact', 'Blush Palette', 'Concealer Stick', 'Bronzer Powder', 'Highlighter Palette'
  ],
  'auto-parts': [],
  'home-kitchen': [
    'Smart TV 65"', 'Coffee Machine', 'Dining Table Set', 'Microwave Oven', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Vacuum Cleaner', 'Blender', 'Toaster',
    'Rice Cooker', 'Pressure Cooker', 'Food Processor', 'Stand Mixer', 'Electric Kettle', 'Air Fryer', 'Dishwasher', 'Water Purifier', 'Ceiling Fan', 'Table Lamp'
  ],
  'health-beauty': [
    'Skincare Set', 'Hair Dryer', 'Electric Toothbrush', 'Massage Chair', 'Fitness Tracker', 'Blood Pressure Monitor', 'Makeup Kit', 'Perfume', 'Shampoo', 'Face Cream',
    'Hair Straightener', 'Nail Care Kit', 'Vitamin Supplements', 'Protein Powder', 'Face Mask', 'Body Lotion', 'Deodorant', 'Lip Balm', 'Moisturizer', 'Sunscreen'
  ],
  'baby-kids': [
    'Baby Stroller', 'Car Seat', 'High Chair', 'Baby Monitor', 'Diaper Bag', 'Baby Crib', 'Toys Set', 'Kids Tablet', 'School Backpack', 'Lunch Box',
    'Baby Clothes', 'Kids Shoes', 'Educational Toys', 'Baby Formula', 'Pacifier', 'Baby Blanket', 'Changing Table', 'Baby Bath Tub', 'Rocking Chair', 'Night Light'
  ],
  sports: [
    'Football', 'Basketball', 'Tennis Racket', 'Golf Club Set', 'Yoga Mat', 'Dumbbells', 'Treadmill', 'Exercise Bike', 'Swimming Goggles', 'Running Watch',
    'Badminton Set', 'Cricket Bat', 'Table Tennis Set', 'Hiking Boots', 'Camping Tent', 'Bicycle', 'Skateboard', 'Boxing Gloves', 'Jump Rope', 'Resistance Bands'
  ],
  books: [
    'Programming Guide', 'Business Strategy', 'Self Help Book', 'Novel Collection', 'Cookbook', 'History Book', 'Science Textbook', 'Art Book', 'Travel Guide', 'Biography',
    'Children Book', 'Comic Book', 'Dictionary', 'Poetry Collection', 'Philosophy Book', 'Health Guide', 'Finance Book', 'Technology Book', 'Romance Novel', 'Mystery Novel'
  ],
  toys: [
    'LEGO Set', 'Barbie Doll', 'Remote Control Car', 'Puzzle Set', 'Board Game', 'Action Figure', 'Teddy Bear', 'Building Blocks', 'Art Supplies', 'Musical Toy',
    'Educational Game', 'Toy Kitchen', 'Toy Car Set', 'Dollhouse', 'Play Tent', 'Magic Set', 'Science Kit', 'Craft Kit', 'Musical Instrument', 'Outdoor Toy'
  ],
  garden: [
    'Garden Tools Set', 'Plant Pots', 'Watering Can', 'Lawn Mower', 'Garden Hose', 'Fertilizer', 'Seeds Pack', 'Garden Gloves', 'Pruning Shears', 'Wheelbarrow',
    'Outdoor Furniture', 'Garden Light', 'Sprinkler System', 'Compost Bin', 'Garden Shed', 'Greenhouse', 'Garden Arch', 'Bird Feeder', 'Garden Statue', 'Mulch'
  ]
};

// Generate auto parts with Kenyan vehicle data
const autoPartTypes = [
  'Brake Pads', 'Air Filter', 'Oil Filter', 'Spark Plugs', 'Battery', 'Alternator', 'Starter Motor', 'Radiator', 'Water Pump', 'Fuel Pump',
  'Timing Belt', 'Clutch Kit', 'Brake Discs', 'Shock Absorbers', 'CV Joint', 'Ball Joint', 'Tie Rod End', 'Control Arm', 'Brake Shoes', 'Brake Fluid',
  'Engine Oil', 'Transmission Oil', 'Coolant', 'Power Steering Fluid', 'Windshield Wipers', 'Headlights', 'Tail Lights', 'Indicators', 'Horn', 'Side Mirrors',
  'Seat Covers', 'Floor Mats', 'Steering Wheel Cover', 'Dashboard Cover', 'Gear Knob', 'Handbrake Cover', 'Car Audio System', 'Speakers', 'Amplifier', 'Subwoofer'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePrice(): { price: number; originalPrice: number } {
  const originalPrice = Math.floor(Math.random() * 200000) + 1000; // 1,000 to 200,000
  const discount = Math.random() * 0.4 + 0.1; // 10% to 50% discount
  const price = Math.floor(originalPrice * (1 - discount));
  return { price, originalPrice };
}

function generateAutoParts(): Product[] {
  const autoParts: Product[] = [];
  let autoPartId = 1;

  // Generate at least 300 auto parts
  for (let i = 0; i < 350; i++) {
    const vehicle = getRandomElement(kenyanVehicles);
    const model = getRandomElement(vehicle.models);
    const year = getRandomElement(vehicle.years);
    const partType = getRandomElement(autoPartTypes);
    const vendor = getRandomElement(['AutoSpare Kenya', 'Mabati Motors', 'Car & General', 'Toyota Kenya', 'Simba Colt', 'Kenya Vehicle Manufacturers']);
    const { price, originalPrice } = generatePrice();
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
    const reviews = Math.floor(Math.random() * 200) + 5;
    const inStock = Math.random() > 0.15; // 85% in stock

    autoParts.push({
      id: autoPartId++,
      name: `${vehicle.make} ${model} ${partType}`,
      price,
      originalPrice,
      image: "/placeholder.svg",
      rating,
      reviews,
      vendor,
      category: 'auto-parts',
      inStock,
      brand: vehicle.make,
      description: `High-quality ${partType.toLowerCase()} for ${vehicle.make} ${model} ${year}. Compatible with multiple years and models.`,
      year,
      make: vehicle.make,
      model
    });
  }

  return autoParts;
}

export function generateMockProducts(count: number = 2000): Product[] {
  const products: Product[] = [];
  let currentId = 1;

  // Generate auto parts first (300+ items)
  const autoParts = generateAutoParts();
  products.push(...autoParts);
  currentId += autoParts.length;

  // Generate other categories
  for (let i = currentId; i <= count; i++) {
    const category = getRandomElement(categories.filter(cat => cat !== 'auto-parts')) as keyof typeof productNames;
    const productName = getRandomElement(productNames[category]);
    const vendor = getRandomElement(vendors);
    
    let brand: string;
    if (brands[category]) {
      brand = getRandomElement(brands[category]);
    } else {
      brand = getRandomElement(brands.general);
    }
    
    const { price, originalPrice } = generatePrice();
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
    const reviews = Math.floor(Math.random() * 500) + 1;
    const inStock = Math.random() > 0.1; // 90% in stock
    
    products.push({
      id: i,
      name: `${brand} ${productName}`,
      price,
      originalPrice,
      image: "/placeholder.svg",
      rating,
      reviews,
      vendor,
      category,
      inStock,
      brand,
      description: `High-quality ${productName.toLowerCase()} from ${brand}. Perfect for your needs with excellent performance and reliability.`
    });
  }
  
  return products;
}

export const mockProducts = generateMockProducts(2000);
