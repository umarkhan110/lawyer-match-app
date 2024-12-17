import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Lawyer, Client } from '@/types';

interface ClientMapProps {
  client: Client;
  nearbyLawyers: Lawyer[];
  onLawyerSelect: (lawyer: Lawyer) => void;
}
const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxApiKey) {
  throw new Error('Mapbox API key is missing. Please check your .env.local file.');
}
export const ClientMap: React.FC<ClientMapProps> = ({
  client,
  nearbyLawyers,
  onLawyerSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxApiKey
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [client.location.longitude, client.location.latitude],
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add client marker
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([client.location.longitude, client.location.latitude])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    return () => {
      markers.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers: mapboxgl.Marker[] = [];

    // Add lawyer markers with popups
    nearbyLawyers.forEach(lawyer => {
      lawyer.officeLocations.forEach(location => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <img src="${lawyer.profileImage}" alt="${lawyer.fullName}" class="w-12 h-12 rounded-full mb-2"/>
            <h3 class="font-bold">${lawyer.fullName}</h3>
            <p class="text-sm">Starting at $${lawyer.startingPrice}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({ color: '#4A90E2' })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => onLawyerSelect(lawyer));
        newMarkers.push(marker);
      });
    });

    setMarkers(newMarkers);
  }, [nearbyLawyers]);

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-[600px] w-full rounded-lg" />
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
        <p className="text-sm font-semibold">🔵 Lawyer Office</p>
        <p className="text-sm font-semibold">🔴 Your Location</p>
      </div>
    </div>
  );
};