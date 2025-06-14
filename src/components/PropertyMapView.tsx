
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MapBox from '@/components/MapBox';
import { Property } from '@/hooks/useProperties';
import { MapPin, Bed, Bath, Square, X } from 'lucide-react';

interface PropertyMapViewProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  center?: [number, number];
}

const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  onPropertySelect,
  onViewDetails,
  center = [36.8219, -1.2921] // Default to Nairobi
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

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

  // Convert properties to map markers
  const markers = properties.map(property => {
    const coordinates = property.location_coordinates 
      ? [(property.location_coordinates as any).x || center[0], (property.location_coordinates as any).y || center[1]]
      : [center[0] + (Math.random() - 0.5) * 0.1, center[1] + (Math.random() - 0.5) * 0.1]; // Random offset if no coordinates

    return {
      id: property.id,
      coordinates: coordinates as [number, number],
      title: property.title,
      color: property.is_featured ? '#f59e0b' : hoveredProperty === property.id ? '#9333ea' : '#3b82f6',
      onClick: () => {
        setSelectedProperty(property);
        onPropertySelect(property);
      }
    };
  });

  // Group nearby properties for clustering
  const clusterMarkers = (markers: typeof markers) => {
    const clustered = [];
    const processed = new Set();
    
    for (let i = 0; i < markers.length; i++) {
      if (processed.has(i)) continue;
      
      const marker = markers[i];
      const cluster = [marker];
      processed.add(i);
      
      // Find nearby markers (within ~100m)
      for (let j = i + 1; j < markers.length; j++) {
        if (processed.has(j)) continue;
        
        const other = markers[j];
        const distance = Math.sqrt(
          Math.pow(marker.coordinates[0] - other.coordinates[0], 2) +
          Math.pow(marker.coordinates[1] - other.coordinates[1], 2)
        );
        
        if (distance < 0.001) { // ~100m
          cluster.push(other);
          processed.add(j);
        }
      }
      
      if (cluster.length > 1) {
        // Create cluster marker
        const avgLng = cluster.reduce((sum, m) => sum + m.coordinates[0], 0) / cluster.length;
        const avgLat = cluster.reduce((sum, m) => sum + m.coordinates[1], 0) / cluster.length;
        
        clustered.push({
          id: `cluster-${i}`,
          coordinates: [avgLng, avgLat] as [number, number],
          title: `${cluster.length} properties`,
          color: '#ef4444',
          onClick: () => {
            // Could implement cluster zoom functionality here
            console.log('Cluster clicked:', cluster);
          }
        });
      } else {
        clustered.push(marker);
      }
    }
    
    return clustered;
  };

  return (
    <div className="relative h-full">
      <MapBox
        center={center}
        zoom={12}
        markers={clusterMarkers(markers)}
        className="w-full h-full"
        onMapClick={() => setSelectedProperty(null)}
      />
      
      {/* Property Info Popup */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <Badge className="bg-purple-600">
                    {getPropertyTypeLabel(selectedProperty.property_type)}
                  </Badge>
                  <Badge variant="outline">
                    For {selectedProperty.listing_type === 'sale' ? 'Sale' : 'Rent'}
                  </Badge>
                  {selectedProperty.is_featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setSelectedProperty(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{selectedProperty.title}</h3>
              
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{selectedProperty.location_address}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                {selectedProperty.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{selectedProperty.bedrooms}</span>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{selectedProperty.bathrooms}</span>
                  </div>
                )}
                {selectedProperty.area_sqm && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{selectedProperty.area_sqm}m²</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {formatPrice(selectedProperty.price, selectedProperty.listing_type)}
                </div>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-600"
                  onClick={() => onViewDetails(selectedProperty)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertyMapView;
