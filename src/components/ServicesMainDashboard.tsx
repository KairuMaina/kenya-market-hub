
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ServicesMainDashboard = () => {
  // Fetch real service bookings data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['service-dashboard-stats'],
    queryFn: async () => {
      const [
        { data: bookings },
        { data: providers },
        { data: categories }
      ] = await Promise.all([
        supabase.from('service_bookings').select('*'),
        supabase.from('service_provider_profiles').select('*').eq('is_active', true),
        supabase.from('service_categories').select('*')
      ]);

      const activeBookings = bookings?.filter(b => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length || 0;

      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => 
        sum + (Number(booking.total_amount) || 0), 0
      ) || 0;

      return {
        activeBookings,
        totalClients: bookings?.length || 0,
        totalProviders: providers?.length || 0,
        completedBookings,
        totalRevenue,
        totalCategories: categories?.length || 0
      };
    }
  });

  // Fetch recent bookings
  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recent-service-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          service_categories(name),
          service_provider_profiles(business_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'confirmed':
        return <Badge className="bg-purple-100 text-purple-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const statsCards = [
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: Calendar,
      description: 'Current active service bookings',
      color: 'text-blue-600'
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      description: 'Total service bookings made',
      color: 'text-green-600'
    },
    {
      title: 'Service Providers',
      value: stats?.totalProviders || 0,
      icon: TrendingUp,
      description: 'Active service providers',
      color: 'text-orange-600'
    },
    {
      title: 'Completed Services',
      value: stats?.completedBookings || 0,
      icon: CheckCircle,
      description: 'Successfully completed services',
      color: 'text-purple-600'
    }
  ];

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Dashboard</h1>
          <p className="text-gray-600">Manage your service bookings and providers</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Total revenue from service bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            KSh {(stats?.totalRevenue || 0).toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            From {stats?.totalClients || 0} total bookings
          </p>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium">
                      {booking.service_categories?.name || booking.service_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service_provider_profiles?.business_name || 'Service Provider'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    {booking.total_amount && (
                      <p className="text-sm font-medium mt-1">
                        KSh {Number(booking.total_amount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertTriangle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No recent bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesMainDashboard;
