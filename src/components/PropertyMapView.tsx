
import React from 'react';
import { Property } from '@/types/product';
import PropertyMap from '@/components/real-estate/PropertyMap';

interface PropertyMapViewProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const PropertyMapView = ({ 
  properties, 
  center = [-1.286389, 36.817223], // Default to Nairobi
  zoom = 10,
  height = '400px'
}: PropertyMapViewProps) => {
  const handlePropertySelect = (property: any) => {
    console.log('Property selected:', property.name || property.title);
  };

  const handleViewDetails = (property: any) => {
    window.open(`/property/${property.id}`, '_blank');
  };

  // Transform properties to match the expected format
  const transformedProperties = properties.map(property => ({
    ...property,
    is_featured: property.is_featured || false,
    title: property.name || property.title,
  }));

  return (
    <div style={{ height, width: '100%' }}>
      <PropertyMap
        properties={transformedProperties as any}
        onPropertySelect={handlePropertySelect}
        onViewDetails={handleViewDetails}
        center={center}
      />
    </div>
  );
};

export default PropertyMapView;
