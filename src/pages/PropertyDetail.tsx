
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  Phone, 
  Mail,
  Calculator,
  Calendar,
  Eye,
  Star
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import MapBox from '@/components/MapBox';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import { useProperty, useIncrementPropertyViews } from '@/hooks/useProperties';
import { useEffect } from 'react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);

  const { data: property, isLoading } = useProperty(id || '');
  const incrementViews = useIncrementPropertyViews();

  useEffect(() => {
    if (property?.id) {
      incrementViews.mutate(property.id);
    }
  }, [property?.id]);

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
    
    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      house: 'House',
      apartment: 'Apartment',
      land: 'Land',
      commercial: 'Commercial',
      office: 'Office'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading property details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <Button onClick={() => navigate('/real-estate')}>
              Back to Properties
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const propertyLocation = property.location_coordinates ? {
    lat: (property.location_coordinates as any).y || -1.2921,
    lng: (property.location_coordinates as any).x || 36.8219
  } : { lat: -1.2921, lng: 36.8219 };

  const propertyMarkers = [{
    id: property.id,
    coordinates: [propertyLocation.lng, propertyLocation.lat] as [number, number],
    title: property.title,
    color: '#9333ea'
  }];

  const nearbyAmenities = [
    { name: 'Nairobi Hospital', distance: '2.5 km', type: 'hospital' },
    { name: 'Village Market', distance: '1.8 km', type: 'shopping' },
    { name: 'International School of Kenya', distance: '3.2 km', type: 'school' },
    { name: 'Karura Forest', distance: '4.1 km', type: 'recreation' }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/real-estate')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={property.images?.[selectedImageIndex] || '/placeholder.svg'} 
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-purple-600">
                      {getPropertyTypeLabel(property.property_type)}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90">
                      For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                    </Badge>
                    {property.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="ghost" className="bg-white/80">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="bg-white/80">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {property.images && property.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer ${
                          selectedImageIndex === index ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location_address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {formatPrice(property.price, property.listing_type)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{property.views_count} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area_sqm}m²</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">About This Property</h3>
                    <p className="text-gray-700">
                      {property.description || 'No description available for this property.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {property.amenities && property.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Amenities</h3>
                          <ul className="space-y-2">
                            {property.amenities.map((amenity, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                {amenity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {property.features && property.features.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Features</h3>
                          <ul className="space-y-2">
                            {property.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Location & Neighborhood</h3>
                    <div className="mb-6">
                      <MapBox
                        center={[propertyLocation.lng, propertyLocation.lat]}
                        zoom={15}
                        markers={propertyMarkers}
                        className="w-full h-80 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Nearby Amenities</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {nearbyAmenities.map((amenity, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{amenity.name}</span>
                            <span className="text-sm text-gray-600">{amenity.distance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mortgage" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Mortgage Calculator</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        Calculate your monthly mortgage payments for this property
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Calculator className="h-4 w-4 mr-2" />
                        Open Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {property.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{property.contact_phone}</span>
                    </div>
                  )}
                  {property.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{property.contact_email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                    onClick={() => setShowInquiryModal(true)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing Type</span>
                  <span className="font-medium">For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="default" className="bg-green-500">Available</Badge>
                </div>
                {property.available_from && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available From</span>
                    <span className="font-medium">{new Date(property.available_from).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Inquiry Modal */}
        <PropertyInquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          property={property}
        />
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;
