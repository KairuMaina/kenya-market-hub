
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Analytics</h1>
        <p className="text-gray-600">Track your service performance and earnings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Analytics dashboard will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesAnalytics;
