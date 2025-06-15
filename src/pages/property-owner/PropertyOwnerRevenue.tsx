
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, Building } from 'lucide-react';

const PropertyOwnerRevenue = () => {
  const revenueStats = [
    { title: 'Total Revenue', value: 'KSh 2,450,000', icon: DollarSign, color: 'green', change: '+12.5%' },
    { title: 'Monthly Revenue', value: 'KSh 185,000', icon: TrendingUp, color: 'blue', change: '+8.2%' },
    { title: 'Properties Sold', value: '8', icon: Building, color: 'purple', change: '+3' },
    { title: 'Active Rentals', value: '12', icon: Calendar, color: 'orange', change: '+2' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Revenue Dashboard
        </h1>
        <p className="text-green-100 mt-2">Track your property income and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue by property type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Apartments', revenue: 'KSh 1,200,000', percentage: '49%', color: 'bg-blue-500' },
                { type: 'Houses', revenue: 'KSh 850,000', percentage: '35%', color: 'bg-green-500' },
                { type: 'Commercial', revenue: 'KSh 400,000', percentage: '16%', color: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.revenue}</div>
                    <div className="text-sm text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest property transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { property: 'Modern Apartment - Westlands', type: 'Sale', amount: 'KSh 4,500,000', date: '2024-01-15' },
                { property: '3BR House - Karen', type: 'Rent', amount: 'KSh 85,000', date: '2024-01-14' },
                { property: 'Studio - Kilimani', type: 'Rent', amount: 'KSh 45,000', date: '2024-01-12' }
              ].map((transaction, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{transaction.property}</h4>
                      <p className="text-sm text-gray-600">{transaction.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{transaction.amount}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyOwnerRevenue;
