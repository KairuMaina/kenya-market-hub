
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Car, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react';

const DriverProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Driver Profile</h1>
        <p className="text-gray-600">Manage your profile and vehicle information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input defaultValue="John Kimani" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input defaultValue="+254 712 345 678" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input defaultValue="john.kimani@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input defaultValue="Kasarani, Nairobi" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Make</label>
              <Input defaultValue="Toyota" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Model</label>
              <Input defaultValue="Vitz" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Plate</label>
              <Input defaultValue="KCA 123A" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Year</label>
              <Input defaultValue="2018" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Member Since</h3>
              <p className="text-sm text-gray-600">Jan 2023</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Car className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Total Rides</h3>
              <p className="text-sm text-gray-600">1,247</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold">Rating</h3>
              <p className="text-sm text-gray-600">4.8 / 5.0</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
              <h3 className="font-semibold mt-2">Status</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default DriverProfile;
