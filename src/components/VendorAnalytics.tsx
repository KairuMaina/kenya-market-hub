
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Star, 
  Eye,
  ShoppingCart,
  Users
} from 'lucide-react';

const VendorAnalytics = () => {
  // Mock data - in real app this would come from API
  const salesData = [
    { month: 'Jan', sales: 45000, orders: 120 },
    { month: 'Feb', sales: 52000, orders: 140 },
    { month: 'Mar', sales: 48000, orders: 110 },
    { month: 'Apr', sales: 61000, orders: 180 },
    { month: 'May', sales: 55000, orders: 150 },
    { month: 'Jun', sales: 67000, orders: 200 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 40, color: '#3b82f6' },
    { name: 'Clothing', value: 30, color: '#10b981' },
    { name: 'Home & Garden', value: 20, color: '#f59e0b' },
    { name: 'Books', value: 10, color: '#ef4444' }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 67500, views: 1200 },
    { name: 'Samsung Galaxy S24', sales: 38, revenue: 45600, views: 980 },
    { name: 'MacBook Air M3', sales: 22, revenue: 110000, views: 750 },
    { name: 'AirPods Pro', sales: 67, revenue: 20100, views: 1500 }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: 'KSh 348,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'This month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'This month'
    },
    {
      title: 'Products Sold',
      value: '2,845',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      description: 'This month'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      description: 'From 456 reviews'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change}
                </span>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Sales (KSh)"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Your best selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {product.sales} sold
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views} views
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    KSh {product.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goals</CardTitle>
          <CardDescription>Track your progress towards monthly targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Revenue Goal</span>
              <span>KSh 348,000 / KSh 400,000</span>
            </div>
            <Progress value={87} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">87% complete - KSh 52,000 remaining</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Orders Goal</span>
              <span>1,234 / 1,500</span>
            </div>
            <Progress value={82} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">82% complete - 266 orders remaining</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Customer Satisfaction</span>
              <span>4.8 / 5.0</span>
            </div>
            <Progress value={96} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">Excellent rating from 456 reviews</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAnalytics;
