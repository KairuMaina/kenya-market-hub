
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboardStats = () => {
  // Real stats will be fetched from API
  const stats = [
    {
      title: 'Total Users',
      value: '0',
      change: '+0%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Products',
      value: '0',
      change: '+0%',
      icon: ShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: 'KSh 0',
      change: '+0%',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      title: 'Growth',
      value: '0%',
      change: '+0%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {stat.change} from last month
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboardStats;
