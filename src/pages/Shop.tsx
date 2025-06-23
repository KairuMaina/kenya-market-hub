
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Plus, Minus, Eye } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ViewProductModal from '@/components/ViewProductModal';

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [quantities, setQuantities] = useState({});

  const categories = [
    'All Categories', 'Electronics', 'Fashion', 'Home & Garden', 
    'Sports', 'Books', 'Automotive', 'Beauty', 'Toys'
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 3500,
      image: 'photo-1505740420928-5e560c06d30e',
      rating: 4.5,
      reviews: 128,
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      vendor: 'TechStore Kenya'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 8900,
      image: 'photo-1523275335684-37898b6baf30',
      rating: 4.8,
      reviews: 89,
      category: 'Electronics',
      description: 'Advanced fitness tracking with heart rate monitor, GPS, and waterproof design.',
      vendor: 'FitTech Kenya'
    },
    {
      id: 3,
      name: 'Premium Coffee Beans',
      price: 1200,
      image: 'photo-1559056199-641a0ac8b55e',
      rating: 4.3,
      reviews: 67,
      category: 'Food & Beverages',
      description: 'Locally sourced premium coffee beans from the highlands of Kenya.',
      vendor: 'Kenyan Coffee Co.'
    },
    {
      id: 4,
      name: 'Organic Skincare Set',
      price: 2800,
      image: 'photo-1556228453-efd6c1ff04f6',
      rating: 4.7,
      reviews: 145,
      category: 'Beauty',
      description: 'Natural skincare set with moisturizer, cleanser, and serum made from organic ingredients.',
      vendor: 'Natural Beauty Kenya'
    },
    {
      id: 5,
      name: 'Cotton T-Shirt',
      price: 1500,
      image: 'photo-1521572163474-6864f9cf17ab',
      rating: 4.2,
      reviews: 89,
      category: 'Fashion',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
      vendor: 'Fashion Hub Kenya'
    },
    {
      id: 6,
      name: 'Kitchen Blender',
      price: 4500,
      image: 'photo-1570197788417-0e82375c9371',
      rating: 4.6,
      reviews: 112,
      category: 'Home & Garden',
      description: 'Powerful kitchen blender perfect for smoothies, soups, and food preparation.',
      vendor: 'Home Essentials'
    }
  ];

  const filteredProducts = selectedCategory === 'All Categories' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === selectedCategory);

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: `https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
        vendor: product.vendor
      });
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });

    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-4">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Shop Smart, Shop Local</h1>
            <p className="text-base text-orange-100">
              Discover amazing products from verified Kenyan vendors
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm h-8 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0' 
                      : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory} ({filteredProducts.length} products)
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border hover:border-orange-200">
                <div className="relative overflow-hidden">
                  <div 
                    className="h-36 bg-cover bg-center cursor-pointer"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/${product.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80)`,
                    }}
                    onClick={() => handleViewProduct(product)}
                  />
                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                    New
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 left-2 h-7 w-7 p-0 bg-white/90 hover:bg-white"
                    onClick={() => handleViewProduct(product)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                
                <CardHeader className="pb-2 px-3 pt-3">
                  <CardTitle 
                    className="text-sm line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                    onClick={() => handleViewProduct(product)}
                  >
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                </CardHeader>
                
                <CardContent className="px-3 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-gray-900">
                      KSH {product.price.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center border rounded-md">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 text-sm font-medium">
                        {quantities[product.id] || 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs h-8"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2"
            >
              View All Products
            </Button>
          </div>
        </div>

        {/* Product View Modal */}
        <ViewProductModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          product={selectedProduct}
        />
      </div>
    </FrontendLayout>
  );
};

export default Shop;
