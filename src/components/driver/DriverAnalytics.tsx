
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  Users,
  MapPin,
  Star
} from 'lucide-react';

const DriverAnalytics = () => {
  const metrics = [
    { label: 'Peak Hours', value: '6-9 PM', change: '+15%', icon: Clock, color: 'blue' },
    { label: 'Best Day', value: 'Friday', change: '+22%', icon: TrendingUp, color: 'green' },
    { label: 'Top Area', value: 'Westlands', change: '+18%', icon: MapPin, color: 'purple' },
    { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: Star, color: 'yellow' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights into your driving performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{metric.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Peak Performance Time</h3>
              <p className="text-sm text-blue-700">You earn 35% more during evening hours (6-9 PM)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">High-Demand Areas</h3>
              <p className="text-sm text-green-700">Westlands and CBD show highest ride requests</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Customer Satisfaction</h3>
              <p className="text-sm text-orange-700">Your rating improved by 0.2 stars this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverAnalytics;
