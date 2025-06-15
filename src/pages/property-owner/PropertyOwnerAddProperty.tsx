
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PropertyOwnerAddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement property creation logic
    setTimeout(() => {
      toast({ title: 'Property added successfully!' });
      navigate('/property-owner/properties');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg flex-1 mr-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Plus className="h-8 w-8" />
            Add New Property
          </h1>
          <p className="text-green-100 mt-2">Create a new property listing</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/property-owner/properties')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Title</label>
                  <Input placeholder="e.g., Modern 3BR Apartment in Westlands" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea 
                    placeholder="Describe your property..." 
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Specify the property location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Address</label>
                  <Input placeholder="e.g., 123 Westlands Road, Nairobi" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input placeholder="e.g., Nairobi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">County</label>
                    <Input placeholder="e.g., Nairobi County" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Specify property features and amenities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Input type="number" min="0" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input type="number" min="0" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (m²)</label>
                    <Input type="number" min="0" placeholder="0" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Amenities</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony'].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox id={amenity} />
                        <label htmlFor={amenity} className="text-sm">{amenity}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your property price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (KSh)</label>
                  <Input type="number" min="0" placeholder="0" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" />
                  <label htmlFor="featured" className="text-sm">Mark as Featured (+10% visibility)</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How buyers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="+254 XXX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyOwnerAddProperty;
