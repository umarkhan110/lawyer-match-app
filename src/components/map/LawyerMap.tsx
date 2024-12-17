import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { OfficeLocation } from '@/types';

interface LawyerMapProps {
  locations: OfficeLocation[];
  onLocationSelect?: (location: OfficeLocation) => void;
}
const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxApiKey) {
  throw new Error('Mapbox API key is missing.');
}
export const LawyerMap: React.FC<LawyerMapProps> = ({ locations, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxApiKey;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [locations[0]?.longitude, locations[0]?.latitude],
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    locations.forEach(location => {
      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      if (onLocationSelect) {
        marker.getElement().addEventListener('click', () => {
          onLocationSelect(location);
        });
      }
    });
  }, [locations, onLocationSelect]);

  return (
    <div ref={mapContainer} className="h-full w-full rounded-lg" />
  );
};