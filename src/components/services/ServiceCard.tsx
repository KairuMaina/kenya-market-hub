
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    business_name: string;
    business_description?: string;
    location_address?: string;
    phone_number?: string;
    email?: string;
    provider_type: string;
    verification_status: string;
    is_active: boolean;
  };
  onContact: (service: any) => void;
  onBook: (service: any) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact, onBook }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-300 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 line-clamp-1">
              {service.business_name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {service.provider_type}
            </CardDescription>
          </div>
          <Badge 
            variant={service.verification_status === 'approved' ? 'default' : 'secondary'}
            className="ml-2 text-xs"
          >
            {service.verification_status === 'approved' ? 'Verified' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {service.business_description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {service.business_description}
          </p>
        )}

        <div className="space-y-2">
          {service.location_address && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3 w-3 text-orange-500 flex-shrink-0" />
              <span className="truncate">{service.location_address}</span>
            </div>
          )}
          
          {service.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3 text-orange-500 flex-shrink-0" />
              <span>{service.phone_number}</span>
            </div>
          )}
          
          {service.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-3 w-3 text-orange-500 flex-shrink-0" />
              <span className="truncate">{service.email}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-gray-600 ml-1">(4.0)</span>
        </div>

        {/* Fixed button container to prevent overlap */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContact(service)}
            className="flex-1 border-orange-200 hover:bg-orange-50 text-orange-600 text-xs"
          >
            Contact
          </Button>
          <Button
            size="sm"
            onClick={() => onBook(service)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs"
          >
            Book Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
