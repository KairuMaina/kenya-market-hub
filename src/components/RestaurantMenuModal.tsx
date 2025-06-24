
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, ShoppingCart, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: any;
}

const RestaurantMenuModal = ({ open, onOpenChange, restaurant }: RestaurantMenuModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!restaurant) return null;

  // Mock menu items for demonstration
  const menuItems = [
    {
      id: 1,
      name: 'Chicken Tikka',
      description: 'Grilled chicken marinated in yogurt and spices',
      price: 1200,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b'
    },
    {
      id: 2,
      name: 'Beef Burger',
      description: 'Juicy beef patty with fresh vegetables',
      price: 800,
      category: 'Fast Food',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 600,
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
    }
  ];

  const categories = ['All', 'Main Course', 'Fast Food', 'Salads', 'Beverages'];

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Restaurant Header */}
          <div className="relative h-48 bg-gradient-to-r from-orange-500 to-red-600">
            {restaurant.banner_url ? (
              <img 
                src={restaurant.banner_url} 
                alt={restaurant.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <h1 className="text-2xl font-bold mb-2">{restaurant.business_name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>25-35 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.business_address || 'Kenya'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                    : 'border-orange-200 hover:bg-orange-50'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-600">
                            KSh {item.price.toLocaleString()}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantMenuModal;
