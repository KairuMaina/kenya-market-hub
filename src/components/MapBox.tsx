
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // This is a demo token, user should replace with their own

interface MapBoxProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    title?: string;
    color?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (coordinates: [number, number]) => void;
  showRoute?: {
    start: [number, number];
    end: [number, number];
  };
  className?: string;
}

const MapBox: React.FC<MapBoxProps> = ({
  center = [36.8219, -1.2921], // Default to Nairobi
  zoom = 12,
  markers = [],
  onMapClick,
  showRoute,
  className = "w-full h-96"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      if (onMapClick) {
        map.current.on('click', (e) => {
          onMapClick([e.lngLat.lng, e.lngLat.lat]);
        });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = marker.color || '#3b82f6';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map.current!);

      if (marker.title) {
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div>${marker.title}</div>`)
          .setLngLat(marker.coordinates)
          .addTo(map.current!);
      }

      if (marker.onClick) {
        el.addEventListener('click', marker.onClick);
      }
    });
  }, [markers, mapLoaded]);

  // Show route
  useEffect(() => {
    if (!map.current || !mapLoaded || !showRoute) return;

    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${showRoute.start[0]},${showRoute.start[1]};${showRoute.end[0]},${showRoute.end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: route
        }
      };

      // Add route to map
      if (map.current!.getSource('route')) {
        (map.current!.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // Fit map to route bounds
      const coordinates = route;
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
      map.current!.fitBounds(bounds, { padding: 50 });
    };

    getRoute();
  }, [showRoute, mapLoaded]);

  return <div ref={mapContainer} className={className} />;
};

export default MapBox;
