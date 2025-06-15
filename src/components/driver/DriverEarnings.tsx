
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Clock
} from 'lucide-react';
import { useDriverEarnings } from '@/hooks/useDriver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DriverEarnings = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const { data: earningsData, isLoading, error } = useDriverEarnings(timeframe);

  const currentData = earningsData || {
    total: 0,
    rides: 0,
    hours: 0,
    average: 0,
    dailyEarnings: []
  };

  const summaryCards = [
    { label: 'Total Earnings', value: `KSH ${currentData.total.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Total Rides', value: currentData.rides, icon: Calendar, color: 'blue' },
    { label: 'Hours Driven', value: `${currentData.hours}h`, icon: Clock, color: 'orange' },
    { label: 'Avg per Ride', value: `KSH ${currentData.average.toLocaleString()}`, icon: TrendingUp, color: 'purple' },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading Earnings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Could not load earnings data.</p>
        <p className="text-gray-500 text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
          <p className="text-gray-600">Track your income and financial performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'week' | 'month' | 'year')}>
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
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100`}>
                  <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown ({timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : 'This Year'})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.dailyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value: number, name: string) => [name === 'amount' ? `KSH ${value.toLocaleString()}`: value, name === 'amount' ? 'Earnings' : 'Rides']}
                />
                <Bar dataKey="amount" fill="#22c55e" name="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverEarnings;
