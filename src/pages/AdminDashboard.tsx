
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Package,
  UserCheck,
  Eye,
  Settings,
  BarChart3,
  Store,
  ShoppingCart
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { title: 'Total Orders', value: '856', icon: ShoppingBag, change: '+23%' },
    { title: 'Revenue', value: 'KSh 2.4M', icon: DollarSign, change: '+18%' },
    { title: 'Active Vendors', value: '45', icon: UserCheck, change: '+8%' },
  ];

  const recentOrders = [
    { id: '#001', customer: 'John Doe', amount: 'KSh 15,000', status: 'Completed', vendor: 'TechHub Kenya' },
    { id: '#002', customer: 'Jane Smith', amount: 'KSh 8,500', status: 'Processing', vendor: 'AutoSpare Kenya' },
    { id: '#003', customer: 'Mike Johnson', amount: 'KSh 12,000', status: 'Shipped', vendor: 'StyleHub' },
    { id: '#004', customer: 'Sarah Wilson', amount: 'KSh 4,500', status: 'Pending', vendor: 'HomeEssentials' },
  ];

  const pendingVendors = [
    { name: 'Electronics Plus', email: 'info@electronicsplus.ke', applied: '2 days ago' },
    { name: 'Fashion Forward', email: 'hello@fashionforward.ke', applied: '1 day ago' },
    { name: 'Auto Masters', email: 'contact@automasters.ke', applied: '3 hours ago' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Package className="h-5 w-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.amount}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === 'Completed' ? 'default' : 
                                order.status === 'Processing' ? 'secondary' :
                                order.status === 'Shipped' ? 'outline' : 'destructive'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pending Vendor Approvals */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <UserCheck className="h-5 w-5 mr-2" />
                    Pending Vendor Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingVendors.map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                          <p className="text-xs text-gray-500">Applied {vendor.applied}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'users':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage all registered users, view their activity, and handle support requests.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Total registered users: 1,234</p>
                <p className="text-sm text-gray-500">• Active users (last 30 days): 856</p>
                <p className="text-sm text-gray-500">• New registrations this week: 45</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'vendors':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Vendor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Approve new vendors, manage existing vendor accounts, and monitor vendor performance.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Active vendors: 45</p>
                <p className="text-sm text-gray-500">• Pending approvals: 3</p>
                <p className="text-sm text-gray-500">• Top performing vendor: TechHub Kenya</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'products':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage product catalog, approve new products, and handle product reports.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Total products: 2,450</p>
                <p className="text-sm text-gray-500">• Products pending approval: 15</p>
                <p className="text-sm text-gray-500">• Most popular category: Electronics</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'orders':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track all orders, manage disputes, and handle refunds.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Total orders: 856</p>
                <p className="text-sm text-gray-500">• Completed orders: 645</p>
                <p className="text-sm text-gray-500">• Pending orders: 211</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View detailed analytics, generate reports, and track platform performance.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Monthly revenue: KSh 2.4M</p>
                <p className="text-sm text-gray-500">• Growth rate: +18%</p>
                <p className="text-sm text-gray-500">• Best selling category: Electronics</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configure platform settings, payment methods, and system preferences.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">• Payment methods: MPesa, Visa, PayPal</p>
                <p className="text-sm text-gray-500">• Delivery partners: Sendy, Fargo Courier</p>
                <p className="text-sm text-gray-500">• Platform commission: 5%</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Soko Smart</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
            <p className="text-gray-600">Manage your Soko Smart platform</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
