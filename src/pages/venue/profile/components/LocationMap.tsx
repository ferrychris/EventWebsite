import React, { useCallback, useEffect, useRef } from 'react';
import { useGoogleMapsScript } from '../../../../utils/maps';
import type { VenueAddress } from '../../../../types/venue';

interface LocationMapProps {
  address: VenueAddress;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapId: '8f541b0b0f6c7563'
};

export default function LocationMap({ address }: LocationMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const { isLoaded } = useGoogleMapsScript();

  const coordinates = {
    lat: address.latitude,
    lng: address.longitude
  };

  const initializeMap = useCallback(() => {
    if (!isLoaded || !coordinates.lat || !coordinates.lng) return;

    const mapElement = document.getElementById('venue-map');
    if (!mapElement) return;

    // Initialize map
    const map = new google.maps.Map(mapElement, {
      ...defaultOptions,
      center: coordinates,
      zoom: 15,
    });

    // Create marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: coordinates,
      title: address.formatted_address
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [isLoaded, coordinates, address.formatted_address]);

  useEffect(() => {
    return initializeMap();
  }, [initializeMap]);

  if (!coordinates.lat || !coordinates.lng) {
    return (
      <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Location coordinates not available</p>
      </div>
    );
  }

  return (
    <div id="venue-map" className="h-64 w-full rounded-lg overflow-hidden" />
  );
}