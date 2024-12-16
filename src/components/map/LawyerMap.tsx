import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { OfficeLocation } from '@/types';

interface LawyerMapProps {
  locations: OfficeLocation[];
  onLocationSelect?: (location: OfficeLocation) => void;
}

export const LawyerMap: React.FC<LawyerMapProps> = ({ locations, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Add markers for each location
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