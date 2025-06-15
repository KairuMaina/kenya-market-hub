
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Eye,
  CreditCard,
  Clock
} from 'lucide-react';

const DriverEarnings = () => {
  const [timeframe, setTimeframe] = useState('week');

  const earningsData = {
    week: {
      total: 18450,
      rides: 47,
      hours: 32.5,
      average: 392.3,
      growth: 12.5
    },
    month: {
      total: 78200,
      rides: 203,
      hours: 145.2,
      average: 385.0,
      growth: 8.7
    },
    year: {
      total: 520000,
      rides: 1840,
      hours: 1250.0,
      average: 282.6,
      growth: 15.3
    }
  };

  const currentData = earningsData[timeframe as keyof typeof earningsData];

  const dailyEarnings = [
    { day: 'Mon', amount: 2850, rides: 8 },
    { day: 'Tue', amount: 3200, rides: 9 },
    { day: 'Wed', amount: 2650, rides: 7 },
    { day: 'Thu', amount: 3800, rides: 12 },
    { day: 'Fri', amount: 4200, rides: 13 },
    { day: 'Sat', amount: 3900, rides: 11 },
    { day: 'Sun', amount: 2850, rides: 8 }
  ];

  const payouts = [
    { id: 1, date: '2024-01-15', amount: 15200, status: 'completed', method: 'Bank Transfer' },
    { id: 2, date: '2024-01-08', amount: 12800, status: 'completed', method: 'Bank Transfer' },
    { id: 3, date: '2024-01-01', amount: 18900, status: 'completed', method: 'Mobile Money' },
    { id: 4, date: '2023-12-25', amount: 14300, status: 'pending', method: 'Bank Transfer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
          <p className="text-gray-600">Track your income and financial performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">KSH {currentData.total.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{currentData.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold">{currentData.rides}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Driven</p>
                <p className="text-2xl font-bold">{currentData.hours}h</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average per Ride</p>
                <p className="text-2xl font-bold">KSH {currentData.average}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyEarnings.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-medium w-12">{day.day}</div>
                  <div className="text-sm text-gray-600">{day.rides} rides</div>
                </div>
                <div className="font-bold text-green-600">KSH {day.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payout.method}</p>
                    <p className="text-sm text-gray-600">{payout.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-bold">KSH {payout.amount.toLocaleString()}</p>
                    <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                      {payout.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverEarnings;
