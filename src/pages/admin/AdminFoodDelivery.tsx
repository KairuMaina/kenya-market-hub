
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  MapPin, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

const AdminFoodDelivery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('restaurants');

  const stats = [
    {
      title: 'Total Restaurants',
      value: '156',
      change: '+12%',
      icon: UtensilsCrossed,
      color: 'text-orange-600'
    },
    {
      title: 'Active Orders',
      value: '89',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+18%',
      icon: Users,
      color: 'text-red-600'
    },
    {
      title: 'Revenue Today',
      value: 'KSh 45,600',
      change: '+22%',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Mama Mboga Kitchen',
      owner: 'Jane Wanjiku',
      cuisine: 'African',
      rating: 4.8,
      orders: 245,
      status: 'Active',
      phone: '+254 700 123 456',
      email: 'jane@mamambogas.com',
      location: 'Westlands'
    },
    {
      id: 2,
      name: 'Pizza Palace',
      owner: 'Mario Rossi',
      cuisine: 'Italian',
      rating: 4.6,
      orders: 189,
      status: 'Active',
      phone: '+254 701 234 567',
      email: 'mario@pizzapalace.com',
      location: 'CBD'
    },
    {
      id: 3,
      name: 'Spice Route',
      owner: 'Raj Patel',
      cuisine: 'Indian',
      rating: 4.7,
      orders: 167,
      status: 'Pending',
      phone: '+254 702 345 678',
      email: 'raj@spiceroute.com',
      location: 'Kilimani'
    }
  ];

  const groceryStores = [
    {
      id: 1,
      name: 'Fresh Mart',
      owner: 'David Kimani',
      category: 'Supermarket',
      rating: 4.6,
      orders: 456,
      status: 'Active',
      phone: '+254 703 456 789',
      email: 'david@freshmart.com'
    },
    {
      id: 2,
      name: 'Organic Valley',
      owner: 'Sarah Mwangi',
      category: 'Organic',
      rating: 4.8,
      orders: 234,
      status: 'Active',
      phone: '+254 704 567 890',
      email: 'sarah@organicvalley.com'
    }
  ];

  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      restaurant: 'Mama Mboga Kitchen',
      amount: 1250,
      status: 'Preparing',
      time: '15 mins ago'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Mary Smith',
      restaurant: 'Pizza Palace',
      amount: 2100,
      status: 'Delivered',
      time: '1 hour ago'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customer: 'Peter Wilson',
      restaurant: 'Spice Route',
      amount: 1800,
      status: 'On the way',
      time: '30 mins ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'on the way': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Delivery Management</h1>
          <p className="text-gray-600">Manage restaurants, grocery stores, and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 border border-orange-200">
            {['restaurants', 'grocery', 'orders'].map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? 'default' : 'ghost'}
                onClick={() => setSelectedTab(tab)}
                className={selectedTab === tab 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'hover:bg-orange-50'
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on selected tab */}
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedTab === 'restaurants' && 'Restaurants'}
                {selectedTab === 'grocery' && 'Grocery Stores'}
                {selectedTab === 'orders' && 'Recent Orders'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                {selectedTab !== 'orders' && (
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add {selectedTab === 'restaurants' ? 'Restaurant' : 'Store'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTab === 'restaurants' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Restaurant</th>
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Cuisine</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Orders</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-b border-orange-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{restaurant.name}</p>
                            <p className="text-sm text-gray-600">{restaurant.location}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{restaurant.owner}</p>
                            <p className="text-sm text-gray-600">{restaurant.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{restaurant.cuisine}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{restaurant.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{restaurant.orders}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(restaurant.status)}>
                            {restaurant.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'grocery' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Store Name</th>
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Orders</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groceryStores.map((store) => (
                      <tr key={store.id} className="border-b border-orange-100">
                        <td className="py-3 px-4 font-medium">{store.name}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{store.owner}</p>
                            <p className="text-sm text-gray-600">{store.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{store.category}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{store.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{store.orders}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(store.status)}>
                            {store.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Order #</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Restaurant</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-orange-100">
                        <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.restaurant}</td>
                        <td className="py-3 px-4">KSh {order.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{order.time}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFoodDelivery;
