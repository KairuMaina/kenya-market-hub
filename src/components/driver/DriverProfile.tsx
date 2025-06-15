
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Car, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react';
import { useMyDriverProfile, useUpdateDriverProfile } from '@/hooks/useDriver';
import { useAuth } from '@/contexts/AuthContext';

const DriverProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyDriverProfile();
  const updateProfile = useUpdateDriverProfile();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    vehicle_make: '',
    vehicle_model: '',
    license_plate: '',
    vehicle_year: '',
  });

  const resetForm = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
        vehicle_make: profile.vehicle_make || '',
        vehicle_model: profile.vehicle_model || '',
        license_plate: profile.license_plate || '',
        vehicle_year: profile.vehicle_year?.toString() || '',
      });
    }
  }

  useEffect(() => {
    resetForm();
  }, [profile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Driver profile not found. Please complete your registration.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <label htmlFor="full_name" className="block text-sm font-medium mb-2">Full Name</label>
              <Input id="full_name" value={formData.full_name} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
              <Input id="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
              <Input id="address" value={formData.address || ''} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="vehicle_make" className="block text-sm font-medium mb-2">Vehicle Make</label>
              <Input id="vehicle_make" value={formData.vehicle_make} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="vehicle_model" className="block text-sm font-medium mb-2">Vehicle Model</label>
              <Input id="vehicle_model" value={formData.vehicle_model} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="license_plate" className="block text-sm font-medium mb-2">License Plate</label>
              <Input id="license_plate" value={formData.license_plate} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="vehicle_year" className="block text-sm font-medium mb-2">Vehicle Year</label>
              <Input id="vehicle_year" type="number" value={formData.vehicle_year} onChange={handleInputChange} />
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
              <p className="text-sm text-gray-600">{new Date(user!.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Car className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Total Rides</h3>
              <p className="text-sm text-gray-600">{profile.total_rides}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold">Rating</h3>
              <p className="text-sm text-gray-600">{(profile.rating || 0).toFixed(1)} / 5.0</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Badge className="bg-green-100 text-green-800 capitalize">{profile.status}</Badge>
              <h3 className="font-semibold mt-2">Status</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
      </div>
    </form>
  );
};

export default DriverProfile;
