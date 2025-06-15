
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize, Eye, Heart } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location_address: string;
  property_type: string;
  listing_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  images?: string[];
  is_featured: boolean;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  center?: [number, number];
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertySelect,
  onViewDetails,
  center = [-1.2921, 36.8219] // Nairobi coordinates
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect(property);
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
    
    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  // Simulate map loading
  React.useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        {!mapLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            {/* Simulated Map Background */}
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
              }}
            />
            
            {/* Property Markers */}
            {properties.map((property, index) => (
              <div
                key={property.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  selectedProperty?.id === property.id ? 'z-20 scale-110' : 'z-10 hover:z-15 hover:scale-105'
                }`}
                style={{
                  left: `${20 + (index % 8) * 10}%`,
                  top: `${20 + Math.floor(index / 8) * 15}%`
                }}
                onClick={() => handlePropertySelect(property)}
              >
                <div className={`px-3 py-2 rounded-full shadow-lg transition-all ${
                  property.is_featured 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : selectedProperty?.id === property.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      KSh {(property.price / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="outline" className="bg-white">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Property Info Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <Card className="shadow-xl border-0">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {selectedProperty.images?.[0] ? (
                    <img 
                      src={selectedProperty.images[0]} 
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight truncate">
                        {selectedProperty.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedProperty.location_address}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">
                      {selectedProperty.property_type}
                    </Badge>
                    <Badge className="bg-purple-600">
                      For {selectedProperty.listing_type}
                    </Badge>
                    {selectedProperty.is_featured && (
                      <Badge className="bg-gradient-to-r from-orange-400 to-red-500">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-purple-600">
                      {formatPrice(selectedProperty.price, selectedProperty.listing_type)}
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-600"
                      onClick={() => onViewDetails(selectedProperty)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {(selectedProperty.bedrooms || selectedProperty.bathrooms || selectedProperty.area_sqm) && (
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      {selectedProperty.bedrooms && (
                        <span>{selectedProperty.bedrooms} beds</span>
                      )}
                      {selectedProperty.bathrooms && (
                        <span>{selectedProperty.bathrooms} baths</span>
                      )}
                      {selectedProperty.area_sqm && (
                        <span>{selectedProperty.area_sqm}m²</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
