
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Car, 
  DollarSign, 
  Navigation, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Star,
  Battery,
  Fuel,
  Users
} from 'lucide-react';

const DriverMainDashboard = () => {
  const [isOnline, setIsOnline] = React.useState(true);

  const quickStats = [
    { title: 'Today\'s Earnings', value: 'KSH 2,850', icon: DollarSign, color: 'green' },
    { title: 'Rides Completed', value: '12', icon: Car, color: 'blue' },
    { title: 'Online Time', value: '6h 45m', icon: Clock, color: 'orange' },
    { title: 'Average Rating', value: '4.9', icon: Star, color: 'yellow' }
  ];

  const activeRides = [
    { id: 1, passenger: 'John Doe', pickup: 'Westlands', destination: 'Karen', fare: 'KSH 450', status: 'pickup' },
    { id: 2, passenger: 'Jane Smith', pickup: 'CBD', destination: 'Kilimani', fare: 'KSH 320', status: 'scheduled' }
  ];

  const recentRides = [
    { id: 1, passenger: 'Mike Johnson', route: 'Westlands → Karen', fare: 'KSH 450', rating: 5, time: '2 hours ago' },
    { id: 2, passenger: 'Sarah Wilson', route: 'CBD → Airport', fare: 'KSH 800', rating: 5, time: '3 hours ago' },
    { id: 3, passenger: 'David Brown', route: 'Kilimani → Eastlands', fare: 'KSH 380', time: '4 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Status Toggle */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Driver Dashboard</h1>
            <p className="text-blue-100">Manage your rides and track your earnings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Offline</span>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-green-500"
              />
              <span className="text-sm">Online</span>
            </div>
            <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-green-500" : ""}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle Status */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Battery className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">Battery</p>
                <p className="text-sm text-gray-600">85% charged</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Fuel className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Fuel</p>
                <p className="text-sm text-gray-600">3/4 tank</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Car className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">Vehicle</p>
                <p className="text-sm text-gray-600">Toyota Vitz - KCA 123A</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Rides */}
      {activeRides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{ride.passenger}</h4>
                      <p className="text-sm text-gray-600">{ride.pickup} → {ride.destination}</p>
                      <p className="text-sm font-medium text-green-600">{ride.fare}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={ride.status === 'pickup' ? 'default' : 'secondary'}>
                      {ride.status === 'pickup' ? 'Picking Up' : 'Scheduled'}
                    </Badge>
                    <Button size="sm">
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{ride.passenger}</h4>
                      <span className="text-sm font-medium text-green-600">{ride.fare}</span>
                    </div>
                    <p className="text-sm text-gray-600">{ride.route}</p>
                    <p className="text-xs text-gray-500">{ride.time}</p>
                  </div>
                  {ride.rating && (
                    <div className="flex items-center ml-3">
                      {[...Array(ride.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Earnings</span>
                <span className="font-medium">KSH 18,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rides Completed</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="font-medium">4.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Online Hours</span>
                <span className="font-medium">32h 15m</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Find Rides</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">View Earnings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Navigation className="h-6 w-6" />
              <span className="text-sm">Route Planner</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Car className="h-6 w-6" />
              <span className="text-sm">Vehicle Info</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverMainDashboard;
