
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route,
  Plus,
  Bookmark,
  TrendingUp
} from 'lucide-react';

const DriverRoutes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const popularRoutes = [
    {
      id: 1,
      from: 'Westlands',
      to: 'Karen',
      distance: '12.5 km',
      avgFare: 450,
      avgTime: '25 min',
      frequency: 15,
      demand: 'high'
    },
    {
      id: 2,
      from: 'CBD',
      to: 'Airport',
      distance: '18.2 km',
      avgFare: 800,
      avgTime: '35 min',
      frequency: 12,
      demand: 'high'
    },
    {
      id: 3,
      from: 'Kilimani',
      to: 'Eastlands',
      distance: '8.7 km',
      avgFare: 320,
      avgTime: '20 min',
      frequency: 8,
      demand: 'medium'
    }
  ];

  const savedRoutes = [
    { id: 1, name: 'Home to Work', from: 'Kasarani', to: 'CBD', isFavorite: true },
    { id: 2, name: 'Airport Run', from: 'Westlands', to: 'JKIA', isFavorite: true },
    { id: 3, name: 'Mall Circuit', from: 'Sarit Centre', to: 'Junction Mall', isFavorite: false }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Route Planning</h1>
        <p className="text-gray-600">Optimize your routes and discover profitable areas</p>
      </div>

      {/* Quick Route Search */}
      <Card>
        <CardHeader>
          <CardTitle>Plan New Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Enter pickup location" className="pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Enter destination" className="pl-10" />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Get Route
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Routes</CardTitle>
          <p className="text-sm text-gray-600">High-demand routes with good earning potential</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Route className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{route.from} → {route.to}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{route.distance}</span>
                      <span>{route.avgTime}</span>
                      <span>~{route.frequency} rides/week</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getDemandColor(route.demand)}>
                    {route.demand} demand
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold text-green-600">KSH {route.avgFare}</p>
                    <p className="text-xs text-gray-500">avg. fare</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Routes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Saved Routes</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bookmark className={`h-4 w-4 ${route.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="font-medium">{route.name}</h4>
                    <p className="text-sm text-gray-600">{route.from} → {route.to}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-1" />
                    Use Route
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Most Profitable</h3>
              <p className="text-sm text-gray-600">CBD → Airport</p>
              <p className="font-bold text-blue-600">KSH 800 avg</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Fastest Route</h3>
              <p className="text-sm text-gray-600">Kilimani → Eastlands</p>
              <p className="font-bold text-green-600">15 min avg</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Route className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold">Most Frequent</h3>
              <p className="text-sm text-gray-600">Westlands → Karen</p>
              <p className="font-bold text-orange-600">15 rides/week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverRoutes;
