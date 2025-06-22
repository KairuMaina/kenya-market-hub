
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Star,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

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
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'preparing': return 'outline';
      case 'on the way': return 'outline';
      case 'delivered': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Delivery Management</h1>
            <p className="text-gray-600">Manage restaurants, grocery stores, and orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
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
        <div className="flex space-x-1 bg-white rounded-lg p-1 border">
          {['restaurants', 'grocery', 'orders'].map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? 'default' : 'ghost'}
              onClick={() => setSelectedTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content based on selected tab */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl capitalize">
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
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add {selectedTab === 'restaurants' ? 'Restaurant' : 'Store'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTab === 'restaurants' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{restaurant.name}</p>
                          <p className="text-sm text-gray-600">{restaurant.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{restaurant.owner}</p>
                          <p className="text-sm text-gray-600">{restaurant.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.orders}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(restaurant.status)}>
                          {restaurant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedTab === 'grocery' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groceryStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{store.owner}</p>
                          <p className="text-sm text-gray-600">{store.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{store.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{store.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{store.orders}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(store.status)}>
                          {store.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedTab === 'orders' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.restaurant}</TableCell>
                      <TableCell>KSh {order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{order.time}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminFoodDelivery;
