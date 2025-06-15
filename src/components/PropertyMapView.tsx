
import React from 'react';
import { Property } from '@/hooks/useProperties';
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
  const handlePropertySelect = (property: Property) => {
    console.log('Property selected:', property.title);
  };

  const handleViewDetails = (property: Property) => {
    window.open(`/property/${property.id}`, '_blank');
  };

  return (
    <div style={{ height, width: '100%' }}>
      <PropertyMap
        properties={properties}
        onPropertySelect={handlePropertySelect}
        onViewDetails={handleViewDetails}
        center={center}
      />
    </div>
  );
};

export default PropertyMapView;
