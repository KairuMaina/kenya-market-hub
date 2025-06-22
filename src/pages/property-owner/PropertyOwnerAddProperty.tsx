import React, { useState }from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateProperty, PropertyFormData } from '@/hooks/usePropertyManagement';
import PropertyImageManager from '@/components/property-owner/PropertyImageManager';

const PropertyOwnerAddProperty = () => {
  const navigate = useNavigate();
  const createProperty = useCreateProperty();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    property_type: 'apartment' as const,
    listing_type: 'sale' as const,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area_sqm: 0,
    location_address: '',
    county: '',
    city: '',
    amenities: [],
    features: [],
    contact_phone: '',
    contact_email: '',
    available_from: '',
    is_featured: false
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...(prev.amenities || []), amenity]
        : (prev.amenities || []).filter(a => a !== amenity)
    }));
  };

  const handleNewImagesUpload = (files: File[]) => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newPreviews] }));
  };

  const handleImagesChange = (images: string[]) => {
    setUploadedImages(images);
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProperty.mutateAsync(formData);
      navigate('/property-owner/properties');
    } catch (error) {
      console.error('Failed to create property:', error);
    }
  };

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
    'Air Conditioning', 'Elevator', 'Backup Generator', 'CCTV'
  ];

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
                  <label className="block text-sm font-medium mb-2">Property Title *</label>
                  <Input 
                    placeholder="e.g., Modern 3BR Apartment in Westlands" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea 
                    placeholder="Describe your property..." 
                    rows={4}
                    className="resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <Select 
                      value={formData.property_type}
                      onValueChange={(value) => handleInputChange('property_type', value)}
                      required
                    >
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
                    <label className="block text-sm font-medium mb-2">Listing Type *</label>
                    <Select 
                      value={formData.listing_type}
                      onValueChange={(value) => handleInputChange('listing_type', value)}
                      required
                    >
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
                  <label className="block text-sm font-medium mb-2">Full Address *</label>
                  <Input 
                    placeholder="e.g., 123 Westlands Road, Nairobi" 
                    value={formData.location_address}
                    onChange={(e) => handleInputChange('location_address', e.target.value)}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input 
                      placeholder="e.g., Nairobi" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">County</label>
                    <Input 
                      placeholder="e.g., Nairobi County" 
                      value={formData.county}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                    />
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
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.bedrooms || ''}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.bathrooms || ''}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (m²)</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.area_sqm || ''}
                      onChange={(e) => handleInputChange('area_sqm', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={amenity}
                          checked={formData.amenities?.includes(amenity) || false}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                        />
                        <label htmlFor={amenity} className="text-sm">{amenity}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>Upload high-quality images of your property</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyImageManager
                  images={uploadedImages}
                  onImagesChange={handleImagesChange}
                  onNewImagesUpload={handleNewImagesUpload}
                  maxImages={10}
                />
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
                  <label className="block text-sm font-medium mb-2">Price (KSh) *</label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    required 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', !!checked)}
                  />
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
                  <Input 
                    placeholder="+254 XXX XXX XXX" 
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available From</label>
                  <Input 
                    type="date" 
                    value={formData.available_from}
                    onChange={(e) => handleInputChange('available_from', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={createProperty.isPending}
            >
              {createProperty.isPending ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyOwnerAddProperty;
