import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Square, Eye, Heart, Phone } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onInquire: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails, onInquire }) => {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={property.images?.[0] || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant="secondary" className="bg-purple-600 text-white">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
          <Badge variant="outline" className="bg-white/90">
            For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {property.is_featured && (
          <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{property.location_address}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {property.bedrooms && property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.area_sqm && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area_sqm}m²</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            <span>{property.views_count}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-purple-600">
            {formatPrice(property.price, property.listing_type)}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onViewDetails(property)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              onClick={() => onInquire(property)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Inquire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
