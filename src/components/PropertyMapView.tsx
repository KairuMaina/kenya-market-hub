
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Property } from '@/hooks/useProperties';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  // Filter properties that have valid coordinates
  const propertiesWithCoords = properties.filter(
    property => property.location_coordinates && 
    typeof property.location_coordinates.lat === 'number' && 
    typeof property.location_coordinates.lng === 'number'
  );

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={[property.location_coordinates!.lat, property.location_coordinates!.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location_address}</p>
                <p className="text-lg font-bold text-green-600">
                  KSH {property.price.toLocaleString()}
                  {property.listing_type === 'rent' && '/month'}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {property.bedrooms && `${property.bedrooms} bed`}
                  {property.bathrooms && ` • ${property.bathrooms} bath`}
                  {property.area_sqm && ` • ${property.area_sqm} sqm`}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMapView;
