
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Clock, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

interface Restaurant {
  id: string;
  business_name: string;
  verification_status: string;
  business_address?: string;
  menu_items: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
  restaurant_id: string;
  restaurant_name: string;
}

const FoodOrderSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Mock data - in real app this would come from API
  const restaurants: Restaurant[] = [
    {
      id: '1',
      business_name: 'Nairobi Bites',
      verification_status: 'approved',
      business_address: 'Westlands, Nairobi',
      menu_items: [
        {
          id: '1',
          name: 'Nyama Choma',
          description: 'Grilled beef with ugali and vegetables',
          price: 800,
          category: 'Main Course',
          available: true
        },
        {
          id: '2',
          name: 'Pilau',
          description: 'Spiced rice with beef',
          price: 600,
          category: 'Main Course',
          available: true
        },
        {
          id: '3',
          name: 'Samosa',
          description: 'Crispy pastry with meat filling',
          price: 100,
          category: 'Appetizer',
          available: true
        }
      ]
    },
    {
      id: '2',
      business_name: 'Pizza Palace',
      verification_status: 'approved',
      business_address: 'CBD, Nairobi',
      menu_items: [
        {
          id: '4',
          name: 'Margherita Pizza',
          description: 'Classic tomato and mozzarella',
          price: 1200,
          category: 'Pizza',
          available: true
        },
        {
          id: '5',
          name: 'Chicken Wings',
          description: 'Spicy buffalo wings',
          price: 700,
          category: 'Appetizer',
          available: true
        }
      ]
    }
  ];

  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        ...item,
        quantity: 1,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.business_name
      }]);
    }

    toast({
      title: 'Added to cart',
      description: `${item.name} added to your cart`,
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setIsPlacingOrder(true);
    try {
      // Group cart items by restaurant
      const ordersByRestaurant = cart.reduce((acc, item) => {
        if (!acc[item.restaurant_id]) {
          acc[item.restaurant_id] = {
            restaurant_id: item.restaurant_id,
            restaurant_name: item.restaurant_name,
            items: [],
            total: 0
          };
        }
        acc[item.restaurant_id].items.push(item);
        acc[item.restaurant_id].total += item.price * item.quantity;
        return acc;
      }, {} as any);

      // Create separate orders for each restaurant
      for (const restaurantOrder of Object.values(ordersByRestaurant) as any[]) {
        const { data: order, error } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id,
            total_amount: restaurantOrder.total,
            status: 'pending',
            payment_status: 'pending',
            shipping_address: {
              restaurant_name: restaurantOrder.restaurant_name,
              type: 'food_delivery'
            }
          })
          .select()
          .single();

        if (error) throw error;

        // Add order items
        const orderItems = restaurantOrder.items.map((item: CartItem) => ({
          order_id: order.id,
          product_id: item.id, // Using item ID as product ID for food items
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        await supabase.from('order_items').insert(orderItems);

        // Send notification to restaurant (dispatch system)
        await supabase.from('notifications').insert({
          user_id: user?.id, // In real app, this would be restaurant owner's ID
          title: 'New Food Order',
          message: `New order from ${user?.email || 'Customer'} for ${restaurantOrder.restaurant_name}`,
          type: 'order',
          metadata: {
            order_id: order.id,
            restaurant_id: restaurantOrder.restaurant_id,
            total_amount: restaurantOrder.total
          }
        });
      }

      toast({
        title: 'Orders Placed!',
        description: 'Your food orders have been dispatched to the restaurants.',
      });

      setCart([]);
      setSelectedRestaurant(null);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive'
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Restaurant List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Restaurants</h2>
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{restaurant.business_name}</CardTitle>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {restaurant.business_address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    30-45 min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restaurant.menu_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="font-bold text-orange-600">KSh {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cart.find(cartItem => cartItem.id === item.id) ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 
                              (cart.find(cartItem => cartItem.id === item.id)?.quantity || 1) - 1
                            )}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id,
                              (cart.find(cartItem => cartItem.id === item.id)?.quantity || 0) + 1
                            )}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => addToCart(item, restaurant)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart */}
      <div className="space-y-4">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({getCartItemsCount()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.restaurant_name}</p>
                      <p className="text-sm text-orange-600">KSh {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>K Sh {getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodOrderSystem;
