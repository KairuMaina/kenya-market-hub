
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Bed, Bath, Square, Eye, Phone, Mail, Calendar, ExternalLink } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import MapBox from '@/components/MapBox';
import { useProperty, useIncrementPropertyViews } from '@/hooks/useProperties';
import { Property } from '@/hooks/useProperties';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showInquiryModal, setShowInquiryModal] = React.useState(false);
  
  const { data: property, isLoading, error } = useProperty(id!);
  const incrementViews = useIncrementPropertyViews();

  useEffect(() => {
    if (property) {
      incrementViews.mutate(property.id);
    }
  }, [property, incrementViews]);

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
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading property details...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
          <div className="text-lg text-red-600">Property not found</div>
          <Button onClick={() => navigate('/real-estate')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Prepare map data
  const mapCenter: [number, number] = property.location_coordinates 
    ? [property.location_coordinates.x, property.location_coordinates.y]
    : [36.8219, -1.2921]; // Default to Nairobi

  const mapMarkers = [{
    id: property.id,
    coordinates: mapCenter,
    title: property.title,
    color: '#9333ea',
    onClick: () => {}
  }];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/real-estate')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            <span>{property.views_count} views</span>
          </div>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video">
            <img 
              src={property.images?.[0] || '/placeholder.svg'} 
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {property.images?.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-square">
                <img 
                  src={image} 
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-purple-600">
                        {getPropertyTypeLabel(property.property_type)}
                      </Badge>
                      <Badge variant="outline">
                        For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                      </Badge>
                      {property.is_featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location_address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">
                      {formatPrice(property.price, property.listing_type)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {property.bedrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="font-semibold">{property.area_sqm}m²</div>
                      <div className="text-sm text-gray-600">Area</div>
                    </div>
                  )}
                </div>

                {property.description && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{property.description}</p>
                    </div>
                  </>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {property.features && property.features.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <Badge key={index} variant="outline">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapBox
                    center={mapCenter}
                    zoom={15}
                    markers={mapMarkers}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Virtual Tour */}
            {property.virtual_tour_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => window.open(property.virtual_tour_url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Take Virtual Tour
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-purple-600" />
                    <span>{property.contact_phone}</span>
                  </div>
                )}
                {property.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-purple-600" />
                    <span>{property.contact_email}</span>
                  </div>
                )}
                {property.available_from && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Available from {new Date(property.available_from).toLocaleDateString()}</span>
                  </div>
                )}
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                  onClick={() => setShowInquiryModal(true)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="font-medium">{property.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline">{property.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>
                {property.county && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">County:</span>
                    <span className="font-medium">{property.county}</span>
                  </div>
                )}
                {property.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{property.city}</span>
                  </div>
                )}
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
