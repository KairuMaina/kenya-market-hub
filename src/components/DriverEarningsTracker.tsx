
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Target,
  Clock,
  Car
} from 'lucide-react';

const DriverEarningsTracker = () => {
  const [timeRange, setTimeRange] = useState('week');

  const earningsData = {
    today: { amount: 2850, rides: 12, hours: 6.75 },
    week: { amount: 18450, rides: 67, hours: 32.5 },
    month: { amount: 75200, rides: 268, hours: 128.5 },
    year: { amount: 890400, rides: 3124, hours: 1542 }
  };

  const weeklyBreakdown = [
    { day: 'Monday', amount: 2450, rides: 8, hours: 5.5 },
    { day: 'Tuesday', amount: 3200, rides: 12, hours: 7.0 },
    { day: 'Wednesday', amount: 2850, rides: 10, hours: 6.25 },
    { day: 'Thursday', amount: 3650, rides: 15, hours: 8.5 },
    { day: 'Friday', amount: 4100, rides: 16, hours: 9.0 },
    { day: 'Saturday', amount: 1800, rides: 6, hours: 4.0 },
    { day: 'Sunday', amount: 400, rides: 0, hours: 2.25 }
  ];

  const monthlyGoals = {
    target: 90000,
    current: 75200,
    percentage: (75200 / 90000) * 100
  };

  const currentData = earningsData[timeRange as keyof typeof earningsData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings Tracker</h1>
          <p className="text-gray-600">Monitor your income and performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  KSH {currentData.amount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12.5% vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rides Completed</p>
                <p className="text-2xl font-bold text-blue-600">{currentData.rides}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8.3% vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Hours</p>
                <p className="text-2xl font-bold text-purple-600">{currentData.hours}h</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">-2.1% vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Hour</p>
                <p className="text-2xl font-bold text-orange-600">
                  KSH {Math.round(currentData.amount / currentData.hours)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15.2% vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Monthly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Progress</span>
              <span className="font-bold">KSH {monthlyGoals.current.toLocaleString()} / KSH {monthlyGoals.target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(monthlyGoals.percentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{monthlyGoals.percentage.toFixed(1)}% completed</span>
              <span className="text-gray-600">
                KSH {(monthlyGoals.target - monthlyGoals.current).toLocaleString()} remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      {timeRange === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyBreakdown.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium">{day.day}</div>
                    <div className="text-sm text-gray-600">
                      {day.rides} rides • {day.hours}h online
                    </div>
                  </div>
                  <div className="font-bold text-green-600">
                    KSH {day.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-600">Best Performing Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Friday Evening (6-8 PM)</span>
                  <span className="text-sm font-medium">KSH 320/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Saturday Morning (8-10 AM)</span>
                  <span className="text-sm font-medium">KSH 295/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monday Rush (7-9 AM)</span>
                  <span className="text-sm font-medium">KSH 280/hour</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-600">Top Routes</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Airport → CBD</span>
                  <span className="text-sm font-medium">Avg KSH 850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Westlands → Karen</span>
                  <span className="text-sm font-medium">Avg KSH 480</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CBD → Kilimani</span>
                  <span className="text-sm font-medium">Avg KSH 320</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverEarningsTracker;
