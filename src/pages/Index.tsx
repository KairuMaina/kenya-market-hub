
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useState, useEffect } from "react";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const brandLogos = [
    { name: "Samsung", logo: "📱", color: "bg-blue-100" },
    { name: "Apple", logo: "🍎", color: "bg-gray-100" },
    { name: "Sony", logo: "📺", color: "bg-red-100" },
    { name: "Toyota", logo: "🚗", color: "bg-green-100" },
    { name: "Nike", logo: "👟", color: "bg-orange-100" },
    { name: "Adidas", logo: "⚽", color: "bg-purple-100" }
  ];

  const categories = [
    {
      name: "Electronics & Tech",
      items: [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          price: "KSh 150,000",
          originalPrice: "KSh 165,000",
          image: "/placeholder.svg",
          rating: 4.9,
          reviews: 234,
          vendor: "TechHub Kenya"
        },
        {
          id: 2,
          name: "Samsung Galaxy S24",
          price: "KSh 95,000",
          originalPrice: "KSh 110,000",
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 189,
          vendor: "TechHub Kenya"
        },
        {
          id: 3,
          name: "MacBook Air M3",
          price: "KSh 145,000",
          originalPrice: "KSh 160,000",
          image: "/placeholder.svg",
          rating: 4.8,
          reviews: 167,
          vendor: "TechHub Kenya"
        },
        {
          id: 4,
          name: "AirPods Pro",
          price: "KSh 25,000",
          originalPrice: "KSh 30,000",
          image: "/placeholder.svg",
          rating: 4.6,
          reviews: 298,
          vendor: "AudioMax Kenya"
        }
      ]
    },
    {
      name: "Fashion & Apparel",
      items: [
        {
          id: 5,
          name: "Men's Leather Jacket",
          price: "KSh 8,500",
          originalPrice: "KSh 12,000",
          image: "/placeholder.svg",
          rating: 4.5,
          reviews: 76,
          vendor: "StyleHub"
        },
        {
          id: 6,
          name: "Women's Evening Dress",
          price: "KSh 3,200",
          originalPrice: "KSh 4,500",
          image: "/placeholder.svg",
          rating: 4.3,
          reviews: 89,
          vendor: "StyleHub"
        },
        {
          id: 7,
          name: "Designer Sneakers",
          price: "KSh 12,000",
          originalPrice: "KSh 15,000",
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 156,
          vendor: "SneakerWorld"
        },
        {
          id: 8,
          name: "Luxury Handbag",
          price: "KSh 18,000",
          originalPrice: "KSh 25,000",
          image: "/placeholder.svg",
          rating: 4.8,
          reviews: 94,
          vendor: "LuxFashion"
        }
      ]
    },
    {
      name: "Auto Parts & Accessories",
      items: [
        {
          id: 9,
          name: "Toyota Brake Pads",
          price: "KSh 4,500",
          originalPrice: "KSh 6,000",
          image: "/placeholder.svg",
          rating: 4.8,
          reviews: 64,
          vendor: "AutoSpare Kenya"
        },
        {
          id: 10,
          name: "Car Audio System",
          price: "KSh 15,000",
          originalPrice: "KSh 20,000",
          image: "/placeholder.svg",
          rating: 4.6,
          reviews: 43,
          vendor: "CarTech"
        },
        {
          id: 11,
          name: "LED Headlights",
          price: "KSh 8,000",
          originalPrice: "KSh 11,000",
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 87,
          vendor: "AutoLights"
        },
        {
          id: 12,
          name: "Performance Tires",
          price: "KSh 25,000",
          originalPrice: "KSh 30,000",
          image: "/placeholder.svg",
          rating: 4.9,
          reviews: 156,
          vendor: "TireWorld"
        }
      ]
    },
    {
      name: "Home & Kitchen",
      items: [
        {
          id: 13,
          name: "Smart TV 55 inch",
          price: "KSh 45,000",
          originalPrice: "KSh 55,000",
          image: "/placeholder.svg",
          rating: 4.6,
          reviews: 234,
          vendor: "HomeElectronics"
        },
        {
          id: 14,
          name: "Coffee Machine",
          price: "KSh 12,000",
          originalPrice: "KSh 16,000",
          image: "/placeholder.svg",
          rating: 4.4,
          reviews: 89,
          vendor: "KitchenPro"
        },
        {
          id: 15,
          name: "Dining Table Set",
          price: "KSh 35,000",
          originalPrice: "KSh 45,000",
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 76,
          vendor: "FurnitureKe"
        },
        {
          id: 16,
          name: "Microwave Oven",
          price: "KSh 8,500",
          originalPrice: "KSh 12,000",
          image: "/placeholder.svg",
          rating: 4.5,
          reviews: 134,
          vendor: "HomeEssentials"
        }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandLogos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % brandLogos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + brandLogos.length) % brandLogos.length);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Compact Hero with Brand Slideshow */}
        <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white py-8 px-6 rounded-lg relative overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Shop from Trusted Brands
            </h2>
            <p className="text-sm md:text-base opacity-90">
              Discover quality products from Kenya's leading marketplace
            </p>
          </div>

          {/* Brand Slideshow */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-4 bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <button onClick={prevSlide} className="p-1 hover:bg-white/20 rounded">
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-black ${brandLogos[currentSlide].color}`}>
                <span className="text-2xl">{brandLogos[currentSlide].logo}</span>
                <span className="font-semibold">{brandLogos[currentSlide].name}</span>
              </div>
              
              <button onClick={nextSlide} className="p-1 hover:bg-white/20 rounded">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex justify-center mt-3 space-x-1">
              {brandLogos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-orange-600 hover:bg-gray-100">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Sections */}
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
              <Link to="/products" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
                See all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.items.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow border border-gray-200 bg-white">
                  <CardContent className="p-3">
                    <div className="relative mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                        DEAL
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{product.vendor}</p>
                    
                    <div className="flex items-center mb-2">
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
                        <span className="text-xs text-gray-600 ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-900">{product.price}</span>
                        <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                      </div>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="bg-gray-900 text-white py-8 px-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-400">2M+</div>
              <div className="text-sm text-gray-300">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">50K+</div>
              <div className="text-sm text-gray-300">Vendors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">1M+</div>
              <div className="text-sm text-gray-300">Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">24/7</div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
