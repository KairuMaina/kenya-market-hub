
import { useState } from 'react';
import { Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Auto Parts',
    'Home & Kitchen',
    'Health & Beauty',
    'Baby & Kids',
    'Sports & Outdoors'
  ];

  const products = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
      price: 35000,
      originalPrice: 42000,
      image: '/placeholder.svg',
      rating: 4.5,
      reviews: 128,
      discount: 17,
      category: 'Electronics',
      seller: 'TechHub Kenya',
      inStock: true,
      description: 'Latest Samsung smartphone with 5G connectivity, 128GB storage, and premium camera system.'
    },
    {
      id: 2,
      name: 'Toyota Corolla Brake Pads',
      price: 4500,
      originalPrice: 6000,
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 89,
      discount: 25,
      category: 'Auto Parts',
      seller: 'AutoSpare Kenya',
      inStock: true,
      description: 'High-quality brake pads compatible with Toyota Corolla 2015-2023 models.'
    },
    {
      id: 3,
      name: 'Nike Air Max Sneakers',
      price: 12000,
      originalPrice: 15000,
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 204,
      discount: 20,
      category: 'Fashion',
      seller: 'StyleHub',
      inStock: true,
      description: 'Comfortable and stylish Nike Air Max sneakers for everyday wear.'
    },
    {
      id: 4,
      name: 'Philips Kitchen Blender',
      price: 8500,
      originalPrice: 11000,
      image: '/placeholder.svg',
      rating: 4.3,
      reviews: 67,
      discount: 23,
      category: 'Home & Kitchen',
      seller: 'HomeEssentials',
      inStock: false,
      description: 'Powerful 700W blender perfect for smoothies, soups, and food preparation.'
    },
    {
      id: 5,
      name: 'iPhone 13 Pro Max',
      price: 85000,
      originalPrice: 95000,
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 156,
      discount: 11,
      category: 'Electronics',
      seller: 'iStore Kenya',
      inStock: true,
      description: 'Apple iPhone 13 Pro Max with 256GB storage, ProRAW camera, and all-day battery.'
    },
    {
      id: 6,
      name: 'Honda Civic Oil Filter',
      price: 1500,
      originalPrice: 2000,
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 43,
      discount: 25,
      category: 'Auto Parts',
      seller: 'AutoSpare Kenya',
      inStock: true,
      description: 'OEM quality oil filter for Honda Civic 2016-2023 models.'
    }
  ];

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{product.discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="absolute top-2 left-2 bg-gray-500">
              Out of Stock
            </Badge>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <h4 className="font-semibold mb-2 line-clamp-2">{product.name}</h4>
          <p className="text-sm text-gray-600 mb-2">by {product.seller}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-green-600">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - simplified for now */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-green-600">KenyaMarket - Products</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left"
                      >
                        {category}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="Min" />
                    <Input placeholder="Max" />
                  </div>
                  <Button className="w-full">Apply</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Ratings</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-sm">
                          {Array.from({ length: rating }, (_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="ml-1 text-sm">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold">All Products</h2>
                <p className="text-gray-600">{products.length} products found</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Products
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
