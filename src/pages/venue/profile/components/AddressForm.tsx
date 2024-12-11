import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useGoogleMapsScript } from '../../../../utils/maps';
import type { VenueAddress } from '../../../../types/venue';

interface AddressFormProps {
  address: VenueAddress | null;
  onAddressChange: (address: VenueAddress) => void;
  primaryColor?: string;
}

export default function AddressForm({ 
  address, 
  onAddressChange, 
  primaryColor = '#1e40af' 
}: AddressFormProps) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded } = useGoogleMapsScript();

  // Set initial input value when address changes
  useEffect(() => {
    if (address?.formatted_address) {
      setInputValue(address.formatted_address);
    }
  }, [address]);

  // Initialize autocomplete
  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !isLoaded) return;

    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    const options = {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'formatted_address', 'geometry', 'name']
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);
    
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place?.geometry?.location) {
        console.error('No location data received from Places API');
        return;
      }

      const newAddress: Partial<VenueAddress> = {
        formatted_address: place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        street_number: '',
        route: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        country: ''
      };

      place.address_components?.forEach((component) => {
        const type = component.types[0];
        switch (type) {
          case 'street_number':
            newAddress.street_number = component.long_name;
            break;
          case 'route':
            newAddress.route = component.long_name;
            break;
          case 'locality':
            newAddress.locality = component.long_name;
            break;
          case 'administrative_area_level_1':
            newAddress.administrative_area_level_1 = component.short_name;
            break;
          case 'postal_code':
            newAddress.postal_code = component.long_name;
            break;
          case 'country':
            newAddress.country = component.long_name;
            break;
        }
      });

      onAddressChange(newAddress as VenueAddress);
      setInputValue(place.formatted_address || '');
    });
  }, [isLoaded, onAddressChange]);

  // Initialize autocomplete when script is loaded
  useEffect(() => {
    if (isLoaded) {
      initAutocomplete();
    }
  }, [isLoaded, initAutocomplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <div className="relative mt-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Start typing to search for an address..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              block w-full pl-10 pr-4 py-2.5 
              border border-gray-300 rounded-lg
              shadow-sm transition-all duration-200
              focus:ring-2 focus:border-transparent
              ${focused ? 'ring-2 border-transparent' : ''}
            `}
            style={{ 
              '--tw-ring-color': primaryColor,
              '--tw-ring-opacity': 0.2
            } as React.CSSProperties}
          />
          <MapPin 
            className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              focused ? 'text-current' : 'text-gray-400'
            }`}
            style={{ color: focused ? primaryColor : undefined }}
          />
        </div>
      </div>

      {address && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              value={address.locality || ''}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-600 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              value={address.administrative_area_level_1 || ''}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-600 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              value={address.postal_code || ''}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-600 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              value={address.country || ''}
              readOnly
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 text-gray-600 px-4 py-2.5"
            />
          </div>
        </div>
      )}
    </div>
  );
}