
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';

const PropertyOwnerProfile = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Profile Settings
        </h1>
        <p className="text-green-100 mt-2">Manage your property owner profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input placeholder="+254 XXX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Textarea placeholder="Your address..." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Property business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input placeholder="Your Property Business" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Description</label>
                <Textarea placeholder="Describe your property business..." rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">License Number</label>
                <Input placeholder="Real estate license number" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <Button variant="outline" className="mb-2">
                <Edit className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your account overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Properties Listed</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Views</span>
                <span className="font-semibold">1,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Inquiries</span>
                <span className="font-semibold">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold">Jan 2023</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerProfile;
