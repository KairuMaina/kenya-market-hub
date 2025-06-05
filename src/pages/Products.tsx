
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Filter, Grid, List } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    {
      id: 1,
      name: "Samsung Galaxy A54 5G Smartphone",
      price: "KSh 35,000",
      originalPrice: "KSh 42,000",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 128,
      discount: "17% OFF",
      vendor: "TechHub Kenya",
      category: "electronics",
      inStock: true
    },
    {
      id: 2,
      name: "Toyota Corolla Front Brake Pads Set",
      price: "KSh 4,500",
      originalPrice: "KSh 6,000",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 64,
      discount: "25% OFF",
      vendor: "AutoSpare Kenya",
      category: "auto-parts",
      inStock: true
    },
    {
      id: 3,
      name: "Women's Elegant Evening Dress",
      price: "KSh 2,800",
      originalPrice: "KSh 3,500",
      image: "/placeholder.svg",
      rating: 4.3,
      reviews: 89,
      discount: "20% OFF",
      vendor: "StyleHub",
      category: "fashion",
      inStock: true
    },
    {
      id: 4,
      name: "Professional Kitchen Blender 1500W",
      price: "KSh 8,900",
      originalPrice: "KSh 12,000",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 156,
      discount: "26% OFF",
      vendor: "HomeEssentials",
      category: "home-kitchen",
      inStock: false
    },
    {
      id: 5,
      name: "iPhone 15 Pro Max 256GB",
      price: "KSh 150,000",
      originalPrice: "KSh 165,000",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 234,
      discount: "9% OFF",
      vendor: "TechHub Kenya",
      category: "electronics",
      inStock: true
    },
    {
      id: 6,
      name: "Men's Casual Leather Shoes",
      price: "KSh 4,200",
      originalPrice: "KSh 5,500",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 94,
      discount: "24% OFF",
      vendor: "StyleHub",
      category: "fashion",
      inStock: true
    },
    {
      id: 7,
      name: "MacBook Air M2 13-inch",
      price: "KSh 145,000",
      originalPrice: "KSh 160,000",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 167,
      discount: "9% OFF",
      vendor: "TechHub Kenya",
      category: "electronics",
      inStock: true
    },
    {
      id: 8,
      name: "Wireless Bluetooth Headphones",
      price: "KSh 3,500",
      originalPrice: "KSh 4,500",
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 312,
      discount: "22% OFF",
      vendor: "AudioMax Kenya",
      category: "electronics",
      inStock: true
    },
    {
      id: 9,
      name: "Women's Handbag Designer Collection",
      price: "KSh 6,800",
      originalPrice: "KSh 8,500",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 78,
      discount: "20% OFF",
      vendor: "StyleHub",
      category: "fashion",
      inStock: true
    },
    {
      id: 10,
      name: "Smart Watch Series 9",
      price: "KSh 25,000",
      originalPrice: "KSh 30,000",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 198,
      discount: "17% OFF",
      vendor: "TechHub Kenya",
      category: "electronics",
      inStock: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'auto-parts', label: 'Auto Parts' },
    { value: 'home-kitchen', label: 'Home & Kitchen' },
    { value: 'health-beauty', label: 'Health & Beauty' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
          <p className="text-gray-600">Discover amazing products from trusted vendors across Kenya</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-6"
        }>
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`hover:shadow-lg transition-shadow bg-white border-gray-200 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            }`}>
              <CardContent className={`p-0 ${viewMode === 'list' ? 'flex flex-row w-full' : ''}`}>
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`object-cover ${
                      viewMode === 'list' 
                        ? 'w-full h-48 rounded-l-lg' 
                        : 'w-full h-48 rounded-t-lg'
                    }`}
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {product.discount}
                  </Badge>
                  {!product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-gray-500">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center ${
                    viewMode === 'list' ? 'justify-between mt-4' : 'justify-between'
                  }`}>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!product.inStock}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Button variant="outline" size="lg" className="px-8">
            Load More Products
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
