
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Clock, 
  MapPin,
  Star
} from 'lucide-react';
import { useDriverAnalytics } from '@/hooks/useDriver';

const DriverAnalytics = () => {
  const { data: analyticsData, isLoading, error } = useDriverAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="ml-4 text-gray-600">Loading Analytics...</p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Could not load analytics data.</p>
        <p className="text-gray-500 text-sm mt-2">
          {(error as Error)?.message || 'An error occurred. You may need more ride history.'}
        </p>
      </div>
    );
  }

  // Workaround for type issue from the hook.
  const typedAnalyticsData = analyticsData as any;

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const metrics = [
    { label: 'Peak Hours', value: typedAnalyticsData.peak_hours ? `${formatHour(typedAnalyticsData.peak_hours.hour)} - ${formatHour(typedAnalyticsData.peak_hours.hour + 1)}` : 'N/A', icon: Clock, color: 'blue' },
    { label: 'Best Day', value: typedAnalyticsData.best_day?.day_name || 'N/A', icon: TrendingUp, color: 'green' },
    { label: 'Top Area', value: typedAnalyticsData.top_destination?.address || 'N/A', icon: MapPin, color: 'purple' },
    { label: 'Avg Rating', value: (typedAnalyticsData.average_rating || 0).toFixed(1), icon: Star, color: 'yellow' }
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
              <p className="text-sm text-blue-700">{typedAnalyticsData.peak_hours ? `You get the most rides around ${formatHour(typedAnalyticsData.peak_hours.hour)}.` : 'Not enough data to determine peak hours.'}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">High-Demand Areas</h3>
              <p className="text-sm text-green-700">{typedAnalyticsData.top_destination ? `${typedAnalyticsData.top_destination.address} is your most frequent destination.` : 'Not enough data for high-demand areas.'}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Busiest Day</h3>
              <p className="text-sm text-orange-700">{typedAnalyticsData.best_day ? `Your busiest day is ${typedAnalyticsData.best_day.day_name}.` : 'Not enough data to determine busiest day.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverAnalytics;
