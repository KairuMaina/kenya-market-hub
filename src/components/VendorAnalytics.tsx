
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ShoppingCart
} from 'lucide-react';
import { useVendorAnalytics } from '@/hooks/useVendorAnalytics';
import LoadingSpinner from '@/components/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const VendorAnalytics = () => {
  const { data: analyticsData, isLoading, error } = useVendorAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading analytics data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            No analytics data available yet. Start selling products to see your performance metrics.
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: `KSh ${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'All time'
    },
    {
      title: 'Total Orders',
      value: analyticsData.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'All time'
    },
    {
      title: 'Products Listed',
      value: analyticsData.totalProducts.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      description: 'Currently active'
    },
    {
      title: 'Average Rating',
      value: analyticsData.averageRating.toString(),
      change: '+0.2',
      trend: 'up',
      icon: Star,
      description: 'Product ratings'
    }
  ];

  // Add colors to category data
  const categoryDataWithColors = analyticsData.categoryData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

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
              <LineChart data={analyticsData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Revenue (KSh)"
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
            {categoryDataWithColors.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDataWithColors}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categoryDataWithColors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryDataWithColors.map((category, index) => (
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
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No category data available yet. Add products to see distribution.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Your best selling products</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.topProducts.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
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
          ) : (
            <div className="text-center text-gray-500 py-12">
              No product data available yet. Add products to see performance metrics.
            </div>
          )}
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
              <span>KSh {analyticsData.totalRevenue.toLocaleString()} / KSh 400,000</span>
            </div>
            <Progress value={Math.min((analyticsData.totalRevenue / 400000) * 100, 100)} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((analyticsData.totalRevenue / 400000) * 100)}% complete
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Products Goal</span>
              <span>{analyticsData.totalProducts} / 50</span>
            </div>
            <Progress value={Math.min((analyticsData.totalProducts / 50) * 100, 100)} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((analyticsData.totalProducts / 50) * 100)}% complete
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Customer Satisfaction</span>
              <span>{analyticsData.averageRating} / 5.0</span>
            </div>
            <Progress value={(analyticsData.averageRating / 5) * 100} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {analyticsData.averageRating > 0 ? 'Good rating from customers' : 'No ratings yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAnalytics;
