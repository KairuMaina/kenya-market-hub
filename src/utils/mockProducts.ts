
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
}

const categories = ['electronics', 'fashion', 'auto-parts', 'home-kitchen', 'health-beauty', 'baby-kids', 'sports', 'books', 'toys', 'garden'];
const vendors = ['TechHub Kenya', 'StyleHub', 'AutoSpare Kenya', 'HomeEssentials', 'BeautyWorld', 'BabyCorner', 'SportZone', 'BookMart', 'ToyLand', 'GreenThumb'];
const brands = ['Samsung', 'Apple', 'Nike', 'Adidas', 'Toyota', 'Sony', 'LG', 'Canon', 'Dell', 'HP'];

const productNames = {
  electronics: [
    'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'MacBook Air M3', 'iPad Pro', 'AirPods Pro', 'Sony WH-1000XM5', 'Dell XPS 13', 'HP Pavilion', 'Canon EOS R6', 'Sony A7 IV',
    'Nintendo Switch', 'PlayStation 5', 'Xbox Series X', 'Smart TV 55"', 'Bluetooth Speaker', 'Wireless Charger', 'Power Bank', 'Gaming Headset', 'Mechanical Keyboard', 'Gaming Mouse'
  ],
  fashion: [
    'Leather Jacket', 'Evening Dress', 'Designer Sneakers', 'Luxury Handbag', 'Silk Blouse', 'Denim Jeans', 'Wool Coat', 'Summer Dress', 'Formal Suit', 'Casual T-Shirt',
    'Running Shoes', 'High Heels', 'Leather Boots', 'Winter Jacket', 'Swimwear', 'Yoga Pants', 'Polo Shirt', 'Cardigan', 'Scarf', 'Sunglasses'
  ],
  'auto-parts': [
    'Brake Pads', 'Car Audio System', 'LED Headlights', 'Performance Tires', 'Air Filter', 'Oil Filter', 'Spark Plugs', 'Car Battery', 'Windshield Wipers', 'Floor Mats',
    'Seat Covers', 'Steering Wheel Cover', 'Dashboard Camera', 'GPS Navigator', 'Car Charger', 'Phone Mount', 'Roof Rack', 'Tow Hitch', 'Exhaust System', 'Suspension Kit'
  ],
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

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePrice(): { price: number; originalPrice: number } {
  const originalPrice = Math.floor(Math.random() * 200000) + 1000; // 1,000 to 200,000
  const discount = Math.random() * 0.4 + 0.1; // 10% to 50% discount
  const price = Math.floor(originalPrice * (1 - discount));
  return { price, originalPrice };
}

export function generateMockProducts(count: number = 2000): Product[] {
  const products: Product[] = [];
  
  for (let i = 1; i <= count; i++) {
    const category = getRandomElement(categories);
    const productName = getRandomElement(productNames[category]);
    const vendor = getRandomElement(vendors);
    const brand = getRandomElement(brands);
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
